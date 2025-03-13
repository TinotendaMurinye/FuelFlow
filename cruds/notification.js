const pool = require("../poolfile"); // Adjust path as necessary

let notificationCrud = {};

// Function to generate a unique notification ID
const generateNotificationId = async () => {
    const [rows] = await pool.execute(`SELECT MAX(notification_id) AS maxId FROM notification`);
    let nextId = 1; // Default to 1 if no records exist

    if (rows[0].maxId) {
        nextId = rows[0].maxId + 1; // Increment by 1
    }

    return nextId;
};

// Create a new notification
notificationCrud.postNotification = async (user_id, firebase_id, notification) => {
    const notification_id = await generateNotificationId(); // Generate unique notification ID

    const query = `
        INSERT INTO notification (notification_id, user_id, firebase_id, notification) 
        VALUES (?, ?, ?, ?)`;

    const values = [notification_id, user_id, firebase_id, notification];

    try {
        await pool.execute(query, values);
        return {
            status: "200",
            message: "Notification created successfully",
            notification_id: notification_id // Return the generated notification ID
        };
    } catch (error) {
        console.error("Error inserting notification:", JSON.stringify(error, null, 2));
        throw new Error("Failed to save notification");
    }
};

// Get all notifications
notificationCrud.getNotifications = async () => {
    const [results] = await pool.execute("SELECT * FROM notification");
    return results;
};

// Get notification by ID
notificationCrud.getNotificationById = async (id) => {
    const [results] = await pool.execute("SELECT * FROM notification WHERE notification_id = ?", [id]);
    return results[0];
};

// Update notification
notificationCrud.updateNotification = async (id, updatedValues) => {
    const setExpressions = Object.keys(updatedValues)
        .map((key) => `${key} = ?`)
        .join(", ");
    const values = [...Object.values(updatedValues), id];
    const query = `UPDATE notification SET ${setExpressions} WHERE notification_id = ?`;
    await pool.execute(query, values);
    return { status: "200", message: "Notification updated successfully" };
};

// Delete notification
notificationCrud.deleteNotification = async (id) => {
    await pool.execute("DELETE FROM notification WHERE notification_id = ?", [id]);
    return { status: "200", message: "Notification deleted successfully" };
};

module.exports = notificationCrud;