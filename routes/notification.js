const express = require("express");
const notificationCrud = require("../cruds/notification"); // Adjust path as necessary
const notificationRouter = express.Router();

// Create a new notification
notificationRouter.post("/", async (req, res) => {
  const { user_id, firebase_id, notification } = req.body;
  if (!user_id || !notification) {
    return res.status(400).json({ status: "400", message: "Missing required fields" });
  }
  try {
    const response = await notificationCrud.postNotification(user_id, firebase_id, notification);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all notifications
notificationRouter.get("/", async (req, res) => {
  try {
    const results = await notificationCrud.getNotifications();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get notification by ID
notificationRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await notificationCrud.getNotificationById(id);
    if (!result) return res.status(404).json({ status: "404", message: "Notification not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update notification by ID
notificationRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedValues = req.body;
  try {
    const response = await notificationCrud.updateNotification(id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete notification by ID
notificationRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await notificationCrud.deleteNotification(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = notificationRouter;