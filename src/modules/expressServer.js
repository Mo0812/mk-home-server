const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ErrorHandler = require("../helpers/ErrorHandler/ErrorHandler");

var app = express(),
    port = process.env.PORT || 8000;

const monitoringRouter = require("../routes/Monitoring/Monitoring");
const systemRouter = require("../routes/System/System");
const smarthomeRouter = require("../routes/Smarthome/Smarthome");
const automationRouter = require("../routes/Automation/Automation");
const documentationRouter = require("../routes/Documentation/Documentation");
const loggingRouter = require("../routes/Logging/Logging");
const mkhtRouter = require("../routes/MKHTemp/MKHTemp");
const devicesRouter = require("../routes/Devices/Devices");

app.use(cors());
app.use(bodyParser.json());
app.use("/smarthome", smarthomeRouter);
app.use("/monitoring", monitoringRouter);
app.use("/system", systemRouter);
app.use("/automation", automationRouter);
app.use("/docs", documentationRouter);
app.use("/logging", loggingRouter);
app.use("/mkht", mkhtRouter);
app.use("/devices", devicesRouter);

app.use((error, req, res, next) => {
    ErrorHandler.handleError(error, res);
});

app.listen(port);
