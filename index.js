const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const admin = require('firebase-admin');

// Firebase Admin SDK initialization
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.APPPORT || 443; // Change the port here

// SSL options
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/srv690692.hstgr.cloud/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/srv690692.hstgr.cloud/fullchain.pem'),
};

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Import routers
const adminRouter = require("./routes/Admin");
const beneficiaryRouter = require("./routes/Beneficiary");
const notificationRouter = require("./routes/notification");
const usersRouter = require("./routes/users");
const fuelPricesRouter = require("./routes/fuel_prices");
const fuelRequestRouter = require("./routes/fuel_request");
const csirEmployeeRouter = require("./routes/csir_employee");
const FBRouter = require("./routes/FBnotification");
const fuelRequestReportRouter = require("./routes/Reports");

// Route usage
app.use("/beneficiary", beneficiaryRouter);
app.use("/MK42", adminRouter);
app.use("/notification", notificationRouter);
app.use("/users", usersRouter);
app.use("/prices", fuelPricesRouter);
app.use("/request", fuelRequestRouter);
app.use("/employee", csirEmployeeRouter);
app.use("/FB", FBRouter);
app.use("/Reports", fuelRequestReportRouter);

// Health check route
app.get("/", (req, res) => {
  res.send("CSIR Fuel Flow");
});

// Sample route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Additional route example
app.post("/api/data", (req, res) => {
  const data = req.body;
  res.json({ received: data });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start the HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});