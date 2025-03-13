const express = require("express");
const userCrud = require("../cruds/users"); // Adjust path as necessary
const usersRouter = express.Router();

// Create a new user
usersRouter.post("/", async (req, res) => {
  const { username, account_type, password, email, auth, firebase, plus } = req.body;

  if (!username || !email || !password || !plus) {
    return res.status(400).json({ status: "400", message: "Missing required fields" });
  }

  try {
    // Check if emp_id (plus) already exists in the database
    const existingUser = await userCrud.getUserByPlus(plus);
    if (existingUser) {
      return res.status(409).json({ status: "409", message: "Employee ID is already registered" });
    }

    const response = await userCrud.postUser(username, account_type, password, email, auth, firebase, plus);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all users
usersRouter.get("/", async (req, res) => {
  try {
    const results = await userCrud.getUsers();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get user by ID
usersRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userCrud.getUserById(id);
    if (!result) return res.status(404).json({ status: "404", message: "User not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update user by ID
usersRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedValues = req.body;
  try {
    const response = await userCrud.updateUser(id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete user by ID
usersRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await userCrud.deleteUser(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

usersRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: "400", message: "Missing required fields" });
  }

  try {
    const user = await userCrud.authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ status: "401", message: "Invalid credentials" });
    }

    // You can also return a token or session info here
    res.status(200).json({ status: "200", message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = usersRouter;