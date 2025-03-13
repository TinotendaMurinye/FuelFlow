// notifications.js
const admin = require('firebase-admin');

const sendNotification = async (token, message) => {
    const messagePayload = {
        notification: {
            title: message.title,
            body: message.body,
        },
        token: token, // The FCM registration token for the recipient
    };

    try {
        const response = await admin.messaging().send(messagePayload);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

// Export the function to use it in other files
module.exports = { sendNotification };