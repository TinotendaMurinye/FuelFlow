const express = require("express");
const fuelPricesCrud = require("../cruds/fuel_prices"); // Adjust path as necessary
const fuelPricesRouter = express.Router();

// Create a new fuel price entry
fuelPricesRouter.post("/", async (req, res) => {
  const { date, currency, user_id } = req.body;
  if (!date || !currency || !user_id) {
    return res.status(400).json({ status: "400", message: "Missing required fields" });
  }
  try {
    const response = await fuelPricesCrud.postFuelPrice(date, currency, user_id);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all fuel prices
fuelPricesRouter.get("/", async (req, res) => {
  try {
    const results = await fuelPricesCrud.getFuelPrices();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get fuel price by ID
fuelPricesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await fuelPricesCrud.getFuelPriceById(id);
    if (!result) return res.status(404).json({ status: "404", message: "Fuel price not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update fuel price by ID
fuelPricesRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedValues = req.body;
  try {
    const response = await fuelPricesCrud.updateFuelPrice(id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete fuel price by ID
fuelPricesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fuelPricesCrud.deleteFuelPrice(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = fuelPricesRouter;