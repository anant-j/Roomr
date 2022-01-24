const {default: Expo} = require("expo-server-sdk");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const expo = new Expo();

exports.sendNotification = functions.https.onRequest(async (req, res) => {
  const notificationMessage = req.query.message;
  if (!notificationMessage) {
    return res.status(400).send("No message specified");
  }
  const notificationRef = await
  db.collection("users").doc("notifications").get();
  if (notificationRef.exists) {
    const notificationList = notificationRef.data();
    sendExpoNotifications(notificationMessage, notificationList.ids);
    res.send("Messages sent");
    return;
  }
  res.send("Done");
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
