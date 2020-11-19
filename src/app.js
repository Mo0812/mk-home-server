const path = require("path");

if (process.env.NODE_ENV == "production") {
    require("dotenv").config({
        path: path.resolve(__dirname, "../.env." + process.env.NODE_ENV),
    });
} else {
    require("dotenv").config();
}
console.log(process.env.NODE_ENV, process.env.MARIADB_DB);

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect: connectTradfri } = require("./controller/Tradfri/Tradfri");
const {
    connect: connectWS,
} = require("./controller/WebsocketServer/WebsocketServer");

connectTradfri();
connectWS();

var app = express(),
    port = process.env.PORT || 8000;

const monitoringRouter = require("./routes/Monitoring/Monitoring");
const systemRouter = require("./routes/System/System");
const smarthomeRouter = require("./routes/Smarthome/Smarthome");

app.use(cors());
app.use(bodyParser.json());
app.use("/smarthome", smarthomeRouter);
app.use("/monitoring", monitoringRouter);
app.use("/system", systemRouter);

app.listen(port);
