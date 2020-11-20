const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

var app = express(),
    port = process.env.PORT || 8000;

const monitoringRouter = require("../routes/Monitoring/Monitoring");
const systemRouter = require("../routes/System/System");
const smarthomeRouter = require("../routes/Smarthome/Smarthome");

app.use(cors());
app.use(bodyParser.json());
app.use("/smarthome", smarthomeRouter);
app.use("/monitoring", monitoringRouter);
app.use("/system", systemRouter);

app.listen(port);
