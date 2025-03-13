const express = require("express");
const adminCrud = require("../cruds/Admin"); // Adjust path as necessary
const adminRouter = express.Router();

// Create a new admin
adminRouter.post("/", async (req, res) => {
  const { email, password, auth_key } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: "400", message: "Missing required fields" });
  }
  try {
    const response = await adminCrud.postAdmin(email, password, auth_key);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all admins
adminRouter.get("/", async (req, res) => {
  try {
    const results = await adminCrud.getAdmins();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get admin by ID
adminRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await adminCrud.getAdminById(id);
    if (!result) return res.status(404).json({ status: "404", message: "Admin not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update admin by ID
adminRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedValues = req.body;
  try {
    const response = await adminCrud.updateAdmin(id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete admin by ID
adminRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await adminCrud.deleteAdmin(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = adminRouter;