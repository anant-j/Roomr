const {default: Expo} = require("expo-server-sdk");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const expo = new Expo();

exports.sendNotification = functions.https.onRequest(async (req, res) => {
  const notificationMessage = req.query.message;
  const recipient = req.query.to;
  if (!notificationMessage) {
    return res.status(400).send("No message specified");
  }
  if (!recipient) {
    return res.status(400).send("No recipient specified");
  }
  const notificationRef = await db.collection("users").doc(recipient).get();
  if (notificationRef.exists) {
    const id = notificationRef.data().expo_token;
    const notificationList = [id];
    sendExpoNotifications(notificationMessage, notificationList);
    res.send("Messages sent");
  } else {
    return res.status(400).send("User not found");
  }
  res.send("Notification sent");
});

exports.signUpTenant = functions.https.onCall(async (data, context) => {
  const userData = data;
  if (!validPayload(userData, "tenant")) {
    return {
      status: "error",
      code: "INVALID_USER_DATA",
    };
  }
  const houseID = userData.houseID.toUpperCase();
  const house = await db.collection("houses").doc(houseID).get();
  const userInFB = await db.collection("users").doc(userData.email).get();
  if (!house.exists) {
    return {
      status: "error",
      code: "HOUSE_DOES_NOT_EXIST",
    };
  }
  if (userInFB.exists) {
    return {
      status: "error",
      code: "USER_ALREADY_EXISTS",
    };
  }
  const userDataFB = {
    name: {
      first: userData.name.first,
      last: userData.name.last,
    },
    type: "tenant",
    phone: userData.phone,
    house: houseID,
    approved: false,
    expo_token: userData.expo_token,
  };
  await db.collection("users").doc(userData.email).set(userDataFB);
  await db
      .collection("houses")
      .doc(houseID)
      .update({
        tenants: admin.firestore.FieldValue.arrayUnion(userData.email),
      });
  const landlord = house.data().landlord;
  const landlordEmailDoc = await db.collection("users").doc(landlord).get();
  if (!landlordEmailDoc.exists) {
    return {
      status: "error",
      code: "LANDLORD_DOES_NOT_EXIST",
    };
  }
  const landlordEmail = [landlordEmailDoc.data().expo_token];
  // eslint-disable-next-line max-len
  sendExpoNotifications(
      `A new tenant: ${userData.name.first} ${userData.name.last} would like 
    to join your household on Roomr. Click this notification to approve them!`,
      landlordEmail,
  );
  return {
    status: "success",
    code: "USER_CREATED",
  };
});

exports.signUpLandlord = functions.https.onCall(async (data, context) => {
  const userData = data;
  let houseCreated = false;
  if (!validPayload(userData, "landlord")) {
    return {
      status: "error",
      code: "INVALID_USER_DATA",
    };
  }
  let houseID = await getHouseId(userData.address);
  if (houseID == 0) {
    houseID = await addHouse(userData.email, userData.address);
    houseCreated = true;
  } else {
    return {
      status: "error",
      code: "HOUSE_ALREADY_EXISTS",
    };
  }
  const userRef = await db.collection("users").doc(userData.email).get();
  if (!userRef.exists) {
    const userDataFB = {
      name: {
        first: userData.name.first,
        last: userData.name.last,
      },
      type: "landlord",
      phone: userData.phone,
      houses: [houseID],
      expo_token: userData.expo_token,
    };
    await db.collection("users").doc(userData.email).set(userDataFB);
  } else {
    if (houseCreated) {
      await db.collection("houses").doc(houseID).delete();
    }
    return {
      status: "error",
      code: "USER_ALREADY_EXISTS",
    };
  }
  return {
    status: "success",
    house: houseID,
  };
});

/**
 * @param  {string} message
 * @param  {Array} tokens
 */
async function sendExpoNotifications(message, tokens) {
  const messages = [];
  for (const pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: pushToken,
      sound: "default",
      body: message,
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  (async () => {
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();
}

/**
 * @param  {object} data
 * @param  {string} type
 * @return {boolean}
 */
function validPayload(data, type) {
  if (
    !data ||
    !data.name ||
    !data.name.first ||
    !data.name.last ||
    !data.email ||
    !data.phone ||
    !data.expo_token
  ) {
    return false;
  }
  if (type == "tenant") {
    if (!data.houseID) {
      return false;
    }
  } else {
    if (!data.address) {
      return false;
    }
  }
  // if (!data.address ||
  //     !data.address.street ||
  //     !data.address.city ||
  //     !data.address.state ||
  //     !data.address.zip
  // ) {
  //   return false;
  // }
  return true;
}

/**
 * @param  {string} email
 * @param  {string} address
 */
async function addHouse(email, address) {
  const landlordData = {
    landlord: email,
    address: address,
  };
  let houseID = generateRandomHouseID();
  let houseExists = (await db.collection("houses").doc(houseID).get()).exists;
  while (houseExists) {
    houseID = generateRandomHouseID();
    houseExists = (await db.collection("houses").doc(houseID).get()).exists;
  }
  await db.collection("houses").doc(houseID).set(landlordData);
  return houseID;
}

/**
 * @param  {string} address
 * @return {string} houseID
 */
async function getHouseId(address) {
  let houseId = 0;
  const houseRef = db.collection("houses");
  const querySnapshot = await houseRef.where("address", "==", address).get();
  if (!querySnapshot.size == 0) {
    houseId = querySnapshot.docs[0].id;
  }
  return houseId;
}

/**
 * @return {string}
 */
function generateRandomHouseID() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
