const express = require('express');
const admin = require('firebase-admin');
const { sendNotification } = require('../notification'); // Import the function
const FBRouter = express.Router();

FBRouter.post('/send-notification', async (req, res) => {
    const { token, title, body } = req.body;
  
    // Check for missing parameters
    if (!token || !title || !body) {
      return res.status(400).json({ status: "400", message: "Missing parameters" });
    }
  
    const message = { title, body };
  
    try {
      await sendNotification(token, message); // Call the notification function
      res.status(200).json({ status: "success", message: "Notification sent" }); // Return JSON response
    } catch (error) {
      console.error('Failed to send notification:', error);
      res.status(500).json({ status: "500", message: error.message }); // Return JSON error response
    }
  });

module.exports = FBRouter;