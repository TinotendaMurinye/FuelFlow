const pool = require("../poolfile"); // Adjust path as necessary
const bcrypt = require("bcrypt"); // Import bcrypt

let userCrud = {};

// Function to generate a unique user ID
const generateUserId = async () => {
    const [rows] = await pool.execute(`SELECT MAX(user_id) AS maxId FROM Users`);
    let nextId = 1; // Default to 1 if no records exist

    if (rows[0].maxId) {
        nextId = parseInt(rows[0].maxId, 10) + 1; // Increment by 1
    }

    return nextId.toString(); // Convert to string as user_id is varchar
};

userCrud.getUserByPlus = async (plus) => {
    const [results] = await pool.execute("SELECT * FROM Users WHERE plus = ?", [plus]);
    return results[0]; // Return the first result or null if not found
};

// Create a new user
userCrud.postUser = async (username, account_type, password, email, auth, firebase, plus) => {
    const user_id = await generateUserId(); // Generate unique user ID
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const query = `
        INSERT INTO Users (user_id, username, account_type, password, email, auth, firebase, plus) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [user_id, username, account_type, hashedPassword, email, auth, firebase, plus];

    try {
        await pool.execute(query, values);
        return {
            status: "200",
            message: "User created successfully",
            user_id: user_id // Return the generated user ID
        };
    } catch (error) {
        console.error("Error inserting user:", JSON.stringify(error, null, 2));
        throw new Error("Failed to save user");
    }
};

// Authenticate user
userCrud.authenticateUser = async (username, password) => {
    const [results] = await pool.execute("SELECT * FROM Users WHERE email = ?", [username]);
    const user = results[0];

    if (!user) {
        return null; // User not found
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare hashed passwords
    return isMatch ? user : null; // Return user if match, else null
};

// Get all users
userCrud.getUsers = async () => {
    const [results] = await pool.execute("SELECT * FROM Users");
    return results;
};

// Get user by ID
userCrud.getUserById = async (id) => {
    const [results] = await pool.execute("SELECT * FROM Users WHERE user_id = ?", [id]);
    return results[0];
};

// Update user
userCrud.updateUser = async (id, updatedValues) => {
    const setExpressions = Object.keys(updatedValues)
        .map((key) => `${key} = ?`)
        .join(", ");
    const values = [...Object.values(updatedValues), id];
    const query = `UPDATE Users SET ${setExpressions} WHERE user_id = ?`;
    await pool.execute(query, values);
    return { status: "200", message: "User updated successfully" };
};

// Delete user
userCrud.deleteUser = async (id) => {
    await pool.execute("DELETE FROM Users WHERE user_id = ?", [id]);
    return { status: "200", message: "User deleted successfully" };
};

module.exports = userCrud;