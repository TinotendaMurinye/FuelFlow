const express = require("express");
const csirEmployeeCrud = require("../cruds/csir_employee"); // Adjust path as necessary
const csirEmployeeRouter = express.Router();

// Create a new employee
csirEmployeeRouter.post("/", async (req, res) => {
  const { name, surname, id_number, dob, sex, phone1, phone2, employee_pos, auth_level, profile, date_added, employee_num, status, plus } = req.body;
  if (!name || !surname || !id_number) {
    return res.status(400).json({ status: "400", message: "Missing required fields" });
  }
  try {
    const response = await csirEmployeeCrud.postEmployee(name, surname, id_number, dob, sex, phone1, phone2, employee_pos, auth_level, profile, date_added, employee_num, status, plus);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get all employees
csirEmployeeRouter.get("/", async (req, res) => {
  try {
    const results = await csirEmployeeCrud.getEmployees();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Get employee by ID
csirEmployeeRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await csirEmployeeCrud.getEmployeeById(id);
    if (!result) return res.status(404).json({ status: "404", message: "Employee not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Update employee by ID
csirEmployeeRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedValues = req.body;
  try {
    const response = await csirEmployeeCrud.updateEmployee(id, updatedValues);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

// Delete employee by ID
csirEmployeeRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await csirEmployeeCrud.deleteEmployee(id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: "500", message: err.message });
  }
});

module.exports = csirEmployeeRouter;