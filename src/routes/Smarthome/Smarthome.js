const express = require("express");
const {
    lightbulbs,
    plugs,
    devices,
    groups,
} = require("../../controller/Tradfri/Tradfri");

const smarthomeRouter = express.Router();

smarthomeRouter.put("/device/brightness", async (req, res) => {
    const { device, brightness } = req.body;

    const light = devices[device].lightList[0];
    light.setBrightness(brightness, 2);
    res.send("ok");
});

smarthomeRouter.put("/device/toggle", async (req, res) => {
    const { device } = req.body;

    const light = devices[device].lightList
        ? devices[device].lightList[0]
        : devices[device].plugList[0];
    light.toggle();
    res.send("ok");
});

smarthomeRouter.put("/device/on", async (req, res) => {
    const { device } = req.body;

    const light = devices[device].lightList
        ? devices[device].lightList[0]
        : devices[device].plugList[0];
    light.turnOn();
    res.send("ok");
});

smarthomeRouter.put("/device/off", async (req, res) => {
    const { device } = req.body;

    const light = devices[device].lightList
        ? devices[device].lightList[0]
        : devices[device].plugList[0];
    light.turnOff();
    res.send("ok");
});

smarthomeRouter.put("/group/brightness", async (req, res) => {
    const { group, brightness } = req.body;

    groups[group].deviceIDs.forEach((deviceID) => {
        const device = devices[deviceID];
        if (device.lightList) {
            device.lightList[0].setBrightness(brightness, 2);
        }
    });
    res.send("ok");
});

smarthomeRouter.put("/group/toggle", async (req, res) => {
    const { group } = req.body;

    groups[group].deviceIDs.forEach((deviceID) => {
        const device = devices[deviceID];
        if (device.lightList) {
            device.lightList[0].toggle();
        } else if (device.plugList) {
            device.plugList[0].toggle();
        }
    });
    res.send("ok");
});

smarthomeRouter.put("/group/on", async (req, res) => {
    const { group } = req.body;

    groups[group].deviceIDs.forEach((deviceID) => {
        const device = devices[deviceID];
        if (device.lightList) {
            device.lightList[0].turnOn();
        } else if (device.plugList) {
            device.plugList[0].turnOn();
        }
    });
    res.send("ok");
});

smarthomeRouter.put("/group/off", async (req, res) => {
    const { group } = req.body;

    groups[group].deviceIDs.forEach((deviceID) => {
        const device = devices[deviceID];
        if (device.lightList) {
            device.lightList[0].turnOff();
        } else if (device.plugList) {
            device.plugList[0].turnOff();
        }
    });
    res.send("ok");
});

smarthomeRouter.get("/list", async (req, res) => {
    res.send({
        lightbulbs: { ...lightbulbs },
        plugs: { ...plugs },
        groups: { ...groups },
    });
});

module.exports = smarthomeRouter;
