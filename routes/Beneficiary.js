const express = require("express");
const beneficiaryCrud = require("../cruds/Beneficiary"); // Adjust path as necessary
const beneficiaryRouter = express.Router();

// Create a new beneficiary
beneficiaryRouter.post("/", async (req, res) => {
  const { Id_number, name, surname, community_pos, department, date, phone1, phone2 } = req.body;
  if (!Id_number || !name || !surname) {
    return res.status(400).json({ status: "400", message: "Missing required fields" });
  }
  try {
    const response = await beneficiaryCrud.postBeneficiary(Id_number, name, surname, community_pos, department, date, phone1, phone2);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all beneficiaries
beneficiaryRouter.get("/", async (req, res) => {
  try {
    const results = await beneficiaryCrud.getBeneficiaries();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get beneficiary by ID
beneficiaryRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await beneficiaryCrud.getBeneficiaryById(id);
    if (!result) return res.status(404).json({ status: "404", message: "Beneficiary not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update beneficiary by ID
beneficiaryRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedValues = req.body;
  try {
    const response = await beneficiaryCrud.updateBeneficiary(id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete beneficiary by ID
beneficiaryRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await beneficiaryCrud.deleteBeneficiary(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = beneficiaryRouter;