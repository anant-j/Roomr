/* eslint-disable max-len */
const {default: Expo} = require("expo-server-sdk");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const validations = require("./validations");
admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const expo = new Expo();

exports.sendMessage = functions.https.onCall(async (data, context) => {
  const notificationMessage = data.message;
  const auth = context.auth;
  if (!auth) {
    return {
      status: "error",
      code: "USER_NOT_AUTHENTICATED",
    };
  }
  const sender = auth.token.email;
  let recipients = data.to;
  if (!notificationMessage) {
    return {
      status: "error",
      code: "NO_MESSAGE_SPECIFIED",
    };
  }
  if (!recipients || recipients.length === 0) {
    return {
      status: "error",
      code: "RECIPIENTS_NOT_SPECIFIED",
    };
  }
  if (!Array.isArray(recipients)) {
    recipients = [recipients];
  }
  const senderDoc = await db.collection("users").doc(sender).get();
  if (!senderDoc.exists) {
    return {
      status: "error",
      code: "USER_DOES_NOT_EXIST",
    };
  }
  const subtitle = `Message from ${senderDoc.data().name.first}`;
  const recipientNotificationTokens = [];
  const allHouseIDs = [];
  for (const recipient of recipients) {
    const recipientDoc = await db.collection("users").doc(recipient).get();
    if (!recipientDoc.exists) {
      return {
        status: "error",
        code: "RECIPIENT_DOES_NOT_EXIST",
      };
    }
    recipientNotificationTokens.push(recipientDoc.data().expo_token);
    allHouseIDs.push(recipientDoc.data().houses);
  }
  if (recipientNotificationTokens.length === 0 || allHouseIDs.length === 0) {
    return {
      status: "error",
      code: "RECIPIENTS_NOT_FOUND",
    };
  }
  const houseId = findCommonElements(allHouseIDs)[0];
  await db
      .collection("houses")
      .doc(houseId)
      .collection("chats")
      .add({
        content: notificationMessage,
        from: sender,
        sentAt: new Date(),
        to: recipients,
      });
  await sendExpoNotifications(notificationMessage, recipientNotificationTokens, subtitle);
  return {
    status: "success",
    code: "MESSAGE_SENT",
  };
});

exports.signUpTenant = functions.https.onCall(async (data, context) => {
  let userData = validPayload(data, "tenant");
  if (!userData.valid) {
    return {
      status: "error",
      code: userData.error,
    };
  }
  userData = userData.sanitizedPayload;
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
    houses: [houseID],
    approved: false,
    expo_token: userData.expo_token,
  };
  const landlord = house.data().landlord;
  const landlordEmailDoc = await db.collection("users").doc(landlord).get();
  if (!landlordEmailDoc.exists) {
    return {
      status: "error",
      code: "LANDLORD_DOES_NOT_EXIST",
    };
  }
  const landlordEmail = [landlordEmailDoc.data().expo_token];
  try {
    await auth.createUser(
        {
          email: userData.email,
          emailVerified: false,
          password: userData.password,
          displayName: userData.name.first + " " + userData.name.last,
          disabled: false,
        },
    );
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      return {
        status: "error",
        code: "USER_ALREADY_EXISTS",
      };
    }
    return {
      status: "error",
      code: "UNEXPECTED_AUTH_ERROR",
    };
  }
  await db.collection("users").doc(userData.email).set(userDataFB);
  await db
      .collection("houses")
      .doc(houseID)
      .update({
        tenants: admin.firestore.FieldValue.arrayUnion(userData.email),
      });
  // eslint-disable-next-line max-len
  sendExpoNotifications(`A new tenant: ${userData.name.first} ${userData.name.last} would like to join your household on Roomr. Click this notification to approve them!`, landlordEmail);
  return {
    status: "success",
    code: "USER_CREATED",
  };
});

exports.signUpLandlord = functions.https.onCall(async (data, context) => {
  let userData = validPayload(data, "landlord");
  if (!userData.valid) {
    return {
      status: "error",
      code: userData.error,
    };
  }
  userData = userData.sanitizedPayload;
  let houseID = await getHouseId(userData.address);
  if (houseID != 0) {
    return {
      status: "error",
      code: "HOUSE_ALREADY_EXISTS",
    };
  }
  const userRef = await db.collection("users").doc(userData.email).get();
  if (userRef.exists) {
    return {
      status: "error",
      code: "USER_ALREADY_EXISTS",
    };
  }
  try {
    await auth.createUser(
        {
          email: userData.email,
          emailVerified: false,
          password: userData.password,
          displayName: userData.name.first + " " + userData.name.last,
          disabled: false,
        },
    );
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      return {
        status: "error",
        code: "USER_ALREADY_EXISTS",
      };
    }
    return {
      status: "error",
      code: "UNEXPECTED_AUTH_ERROR",
    };
  }
  houseID = await addHouse(userData.email, userData.address);
  const userDataFB = {
    name: {
      first: userData.name.first,
      last: userData.name.last,
    },
    type: "landlord",
    phone: userData.phone,
    houses: [houseID],
    approved: true,
    expo_token: userData.expo_token,
  };
  await db.collection("users").doc(userData.email).set(userDataFB);
  return {
    status: "success",
    house: houseID,
  };
});

exports.resetDB = functions.https.onRequest(async (req, res) => {
  const token = req.query.token;
  if (token!="4ZMGFEHLV5HV") {
    res.status(403).send("Invalid token");
    return;
  }
  const sampleHouseID = "YOFQXWK3";
  const sampleHouseData = {
    address: "123 Main St",
    landlord: "landlord@roomr.com",
    tenants: ["tenant@roomr.com"],
  };
  const sampleTenantID = "tenant@roomr.com";
  const sampleTenantData = {
    name: {first: "Tenant", last: "Roomr"},
    phone: "1234567890",
    type: "tenant",
    houses: [sampleHouseID],
    approved: true,
    expo_token: "ExponentPushToken[Hz5s8sN-hvBu6Hl6Ka91Gk]",
  };
  const sampleLandlordID = sampleHouseData.landlord;
  const sampleLandlordData = {
    name: {first: "Landlord", last: "Roomr"},
    phone: "1234567890",
    type: "landlord",
    houses: [sampleHouseID],
    approved: true,
    expo_token: "ExponentPushToken[Hz5s8sN-hvBu6Hl6Ka91Gk]",
  };

  const sampleChat = {
    content: "hello",
    to: ["tenant@roomr.com"],
    from: "tenant@roomr.com",
    sentAt: new Date(),
  };

  const sampleTask = {
    content: "Laundry",
    createdBy: "tenant@roomr.com",
    createdOn: new Date(),
    due: new Date(),
  };

  const sampleTicket = {
    content: "Fix Laundry Machine",
    createdBy: "tenant@roomr.com",
    createdOn: new Date(),
  };

  const authUsers = await auth.listUsers();
  for (const authUser of authUsers.users) {
    await auth.deleteUser(authUser.uid);
  }
  await auth.createUser(
      {
        email: sampleLandlordID,
        emailVerified: false,
        password: "password",
        displayName: sampleLandlordData.name.first +
         " " + sampleLandlordData.name.last,
        disabled: false,
      },
  );
  await auth.createUser(
      {
        email: sampleTenantID,
        emailVerified: false,
        password: "password",
        displayName: sampleTenantData.name.first +
        " " + sampleTenantData.name.last,
        disabled: false,
      },
  );
  await db.collection("users").get().then((snapshot) => {
    snapshot.forEach((doc) => {
      doc.ref.delete();
    });
  });
  const housesCollection = await db.collection("houses").get();
  for (const doc of housesCollection.docs) {
    const collections = await db.collection("houses").doc(doc.id).listCollections();
    for (const collection of collections) {
      await deleteCollection(db, `houses/${doc.id}/${collection.id}`, 100);
    }
    await doc.ref.delete();
  }
  await db.collection("users").doc(sampleTenantID).set(sampleTenantData);
  await db.collection("houses").doc(sampleHouseID).set(sampleHouseData);
  await db.collection("users").doc(sampleLandlordID).set(sampleLandlordData);
  await db.collection("houses").doc(sampleHouseID).collection("chats").add(sampleChat);
  await db.collection("houses").doc(sampleHouseID).collection("tasks").add(sampleTask);
  await db.collection("houses").doc(sampleHouseID).collection("tickets").add(sampleTicket);
  res.send("Database reset");
});


/**
 * @param  {string} message
 * @param  {Array} tokens
 * @param {string} subtitle
 */
async function sendExpoNotifications(message, tokens, subtitle = false) {
  const messages = [];
  for (const pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    if (!subtitle) {
      messages.push({
        to: pushToken,
        sound: "default",
        body: message,
      });
    } else {
      messages.push({
        to: pushToken,
        sound: "default",
        body: message,
        subtitle: subtitle,
      });
    }
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
  const sanitizedPayload = {};
  if (!data) {
    return {
      valid: false,
      error: "INVALID_PAYLOAD",
    };
  }
  if (!data.name ||
    !data.name.first ||
    !data.name.last ||
    !validations.name(data.name.first).success ||
    !validations.name(data.name.last).success) {
    return {
      valid: false,
      error: "invalid-name",
    };
  } else {
    sanitizedPayload.name = {
      first: validations.name(data.name.first).sanitized,
      last: validations.name(data.name.last).sanitized,
    };
    if (!data.email || !validations.email(data.email).success) {
      return {
        valid: false,
        error: "invalid-email",
      };
    } else {
      sanitizedPayload.email = validations.email(data.email).sanitized;
    }
    if (!data.password || !validations.password(data.password).success) {
      return {
        valid: false,
        error: "invalid-password",
      };
    } else {
      sanitizedPayload.password = validations.password(data.password).sanitized;
    }
    if (!data.phone || !validations.phone(data.phone).success) {
      return {
        valid: false,
        error: "invalid-phone-number",
      };
    } else {
      sanitizedPayload.phone = validations.phone(data.phone).sanitized;
    }
    if (!data.expo_token) {
      return {
        valid: false,
        error: "INVALID_EXPO_TOKEN",
      };
    } else {
      sanitizedPayload.expo_token = data.expo_token;
    }
    if (type == "tenant") {
      if (!data.houseID || !validations.houseID(data.houseID).success) {
        return {
          valid: false,
          error: "invalid-house-id",
        };
      } else {
        sanitizedPayload.houseID = validations.houseID(data.houseID).sanitized;
      }
    } else {
      if (!data.address || !validations.address(data.address).success) {
        return {
          valid: false,
          error: "invalid-address",
        };
      } else {
        sanitizedPayload.address = validations.address(data.address).sanitized;
      }
    }
    return {
      valid: true,
      sanitizedPayload: sanitizedPayload,
    };
  }
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

/**
 * @param  {array} arrays
 * @return {array}
 */
function findCommonElements(arrays) {
  const result = arrays.shift().filter(function(v) {
    return arrays.every(function(a) {
      return a.indexOf(v) !== -1;
    });
  });
  return result;
}

/**
 * @param  {FirebaseFirestore.Firestore} db
 * @param  {string} collectionPath
 * @param  {number} batchSize
 */
async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}
/**
 * @param  {FirebaseFirestore.Firestore} db
 * @param  {any} query
 * @param  {any} resolve
 */
async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

