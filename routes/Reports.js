const express = require("express");
const fuelRequestReportCrud = require("../cruds/Reports"); // Adjust path as necessary
const fuelRequestReportRouter = express.Router();

// Get fuel requests by beneficiary
fuelRequestReportRouter.get("/beneficiary/:beneficiary", async (req, res) => {
    const { beneficiary } = req.params;
    try {
        const results = await fuelRequestReportCrud.getFuelRequestsByBeneficiary(beneficiary);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ status: "500", message: err.message });
    }
});
// Get monthly summary report
fuelRequestReportRouter.get("/monthly-summary", async (req, res) => {
    try {
        const summary = await fuelRequestReportCrud.getMonthlySummaryReport();
        res.status(200).json(summary);
    } catch (err) {
        res.status(500).json({ status: "500", message: err.message });
    }
});
// Get fuel requests by authoriser
fuelRequestReportRouter.get("/authoriser/:authoriser", async (req, res) => {
    const { authoriser } = req.params;
    try {
        const results = await fuelRequestReportCrud.getFuelRequestsByAuthoriser(authoriser);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ status: "500", message: err.message });
    }
});

// Get fuel requests by approver
fuelRequestReportRouter.get("/approver/:approver", async (req, res) => {
    const { approver } = req.params;
    try {
        const results = await fuelRequestReportCrud.getFuelRequestsByApprover(approver);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ status: "500", message: err.message });
    }
});

// Get fuel requests by initiator
fuelRequestReportRouter.get("/initiator/:initiator", async (req, res) => {
    const { initiator } = req.params;
    try {
        const results = await fuelRequestReportCrud.getFuelRequestsByInitiator(initiator);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ status: "500", message: err.message });
    }
});

// Get fuel requests by recommender
fuelRequestReportRouter.get("/recommender/:recommender", async (req, res) => {
    const { recommender } = req.params;
    try {
        const results = await fuelRequestReportCrud.getFuelRequestsByRecommender(recommender);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ status: "500", message: err.message });
    }
});

// Get fuel requests by status
fuelRequestReportRouter.get("/status/:status", async (req, res) => {
    const { status } = req.params;
    try {
        const results = await fuelRequestReportCrud.getFuelRequestsByStatus(status);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ status: "500", message: err.message });
    }
});

// Get fuel requests by month
fuelRequestReportRouter.get("/month/:month", async (req, res) => {
    const { month } = req.params;
    try {
        const results = await fuelRequestReportCrud.getFuelRequestsByMonth(month);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ status: "500", message: err.message });
    }
});

// Get fuel requests by year
fuelRequestReportRouter.get("/year/:year", async (req, res) => {
    const { year } = req.params;
    try {
        const results = await fuelRequestReportCrud.getFuelRequestsByYear(year);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ status: "500", message: err.message });
    }
});

// Calculate total amount requested by status
fuelRequestReportRouter.get("/total-amount/:status", async (req, res) => {
    const { status } = req.params;
    try {
        const total = await fuelRequestReportCrud.calculateTotalAmountRequestedByStatus(status);
        res.status(200).json(total);
    } catch (err) {
        res.status(500).json({ status: "500", message: err.message });
    }
});

module.exports = fuelRequestReportRouter;