const express = require("express");
const fuelRequestCrud = require("../cruds/fuel_request"); // Adjust path as necessary
const fuelRequestRouter = express.Router();

// Create a new fuel request
fuelRequestRouter.post("/", async (req, res) => {
  const {
    beneficiary,
    id_number,
    phone1,
    phone2,
    community_pos,
    purpose,
    amnt_req,
    amnt_iss,
    date_iss,
    date_req,
    status,
    initiator,
    recommender,
    approver,
    authoriser,
    recipient, // Corrected spelling from 'reciepient' to 'recipient'
    urgency,
    plus,
  } = req.body;

  // Check for required fields
  if (!beneficiary || !id_number || !phone1 || !purpose) {
    return res.status(400).json({ status: "400", message: "Missing required fields" });
  }

  // Log the request body for debugging
  console.log("Received request body:", req.body);

  try {
    const response = await fuelRequestCrud.postFuelRequest(
      beneficiary,
      id_number,
      phone1,
      phone2 || null, // Set to null if not provided
      community_pos || null,
      purpose,
      amnt_req || null, // Set to null if not provided
      amnt_iss || 0, // Default to 0 if not provided
      date_iss || "N/A",
      date_req || new Date().toISOString(), // Default to current date if not provided
      status || "initiated",
      initiator || null,
      recommender || null,
      approver || null,
      authoriser || null,
      recipient || null, // Set to null if not provided
      urgency || "normal",
      plus || null
    );

    res.status(200).json(response);
  } catch (err) {
    console.error("Error inserting fuel request:", err); // Log the error for debugging
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all fuel requests
fuelRequestRouter.get("/", async (req, res) => {
  try {
    const results = await fuelRequestCrud.getFuelRequests();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});
fuelRequestRouter.get("/Pending/", async (req, res) => {
  try {
    const results = await fuelRequestCrud.getPending();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get fuel request by ID
fuelRequestRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await fuelRequestCrud.getFuelRequestById(id);
    if (!result) return res.status(404).json({ status: "404", message: "Fuel request not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});
// Get complete fuel request by ID
fuelRequestRouter.get("/complete/:id", async (req, res) => {
  const { id } = req.params;
  try {
      const result = await fuelRequestCrud.getCompleteFuelRequestById(id);
      if (!result) return res.status(404).json({ status: "404", message: "Fuel request not found" });
      res.status(200).json(result);
  } catch (err) {
      res.status(500).json({ status: "500", message: err.message });
  }
});

// Update fuel request by ID
fuelRequestRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedValues = req.body;
  try {
    const response = await fuelRequestCrud.updateFuelRequest(id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete fuel request by ID
fuelRequestRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fuelRequestCrud.deleteFuelRequest(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get fuel requests by initiator
fuelRequestRouter.get("/initiator/:initiator", async (req, res) => {
  const { initiator } = req.params;
  try {
    const result = await fuelRequestCrud.getFuelRequestsByInitiator(initiator);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get fuel requests by recommender
fuelRequestRouter.get("/recommender/:recommender", async (req, res) => {
  const { recommender } = req.params;
  try {
    const result = await fuelRequestCrud.getFuelRequestsByRecommender(recommender);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get fuel requests by approver
fuelRequestRouter.get("/approver/:approver", async (req, res) => {
  const { approver } = req.params;
  try {
    const result = await fuelRequestCrud.getFuelRequestsByApprover(approver);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get fuel requests by authoriser
fuelRequestRouter.get("/authoriser/:authoriser", async (req, res) => {
  const { authoriser } = req.params;
  try {
    const result = await fuelRequestCrud.getFuelRequestsByAuthoriser(authoriser);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get fuel requests by recipient
fuelRequestRouter.get("/recipient/:recipient", async (req, res) => {
  const { recipient } = req.params;
  try {
    const result = await fuelRequestCrud.getFuelRequestsByRecipient(recipient);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get fuel requests by status
fuelRequestRouter.get("/status/:status", async (req, res) => {
  const { status } = req.params;
  try {
    const result = await fuelRequestCrud.getFuelRequestsByStatus(status);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Calculate total amount requested by status
fuelRequestRouter.get("/total-amount/:status", async (req, res) => {
  const { status } = req.params;
  try {
    const total = await fuelRequestCrud.calculateTotalAmountRequestedByStatus(status);
    res.status(200).json(total);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = fuelRequestRouter;