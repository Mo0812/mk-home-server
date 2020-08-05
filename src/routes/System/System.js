const express = require("express");
const Display = require("../../controller/System/Display/Display");

const display = new Display();

const systemRouter = express.Router();

systemRouter.get("/display/status", async (req, res) => {
    res.send(await display.status());
});

systemRouter.put("/display/on", async (req, res) => {
    res.send(await display.turnOnOff(true));
});

systemRouter.put("/display/off", async (req, res) => {
    res.send(await display.turnOnOff(false));
});

systemRouter.put("/display/brightness", async (req, res) => {
    const { brightness } = req.body;
    res.send(await display.setBrightness(brightness));
});

module.exports = systemRouter;
