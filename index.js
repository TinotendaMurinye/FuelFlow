const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require('body-parser');
//firebase
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
//end
const app = express();
const PORT = process.env.APPPORT || 3003;
app.use(bodyParser.json());
// Importing the routers
const adminRouter = require("./routes/Admin");
const beneficiaryRouter = require("./routes/Beneficiary");
const notificationRouter = require("./routes/notification");
const usersRouter = require("./routes/users");
const fuelPricesRouter = require("./routes/fuel_prices");
const fuelRequestRouter = require("./routes/fuel_request");
const csirEmployeeRouter = require("./routes/csir_employee");
const FBRouter = require("./routes/FBnotification")
const fuelRequestReportRouter = require("./routes/Reports")
// Middleware
// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" })); // JSON parsing with limit
app.use(express.urlencoded({ limit: "100mb", extended: true })); // URL-encoded data with limit

// Route Usage
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
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});