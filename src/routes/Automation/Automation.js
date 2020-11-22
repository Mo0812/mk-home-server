const express = require("express");
const PersistentStorage = require("../../controller/Automation/PersistentStorage");

const automationRouter = express.Router();

automationRouter.get("/export", async (req, res) => {
    res.header("Content-Type", "text/csv");
    res.send(await PersistentStorage.exportDeviceState());
});

module.exports = automationRouter;
