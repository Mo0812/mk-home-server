const express = require("express");
const devices = require("../../controller/Devices/Devices");
const ApiError = require("../../helpers/Errors/ApiError");

const devicesRouter = express.Router();

devicesRouter.get("/all", async (req, res, next) => {
    try {
        const response = await devices.getConnectedDevices();
        res.send(response);
    } catch (error) {
        next(new ApiError(500, error));
    }
});

devicesRouter.get("/:id", async (req, res, next) => {
    try {
        const response = await devices.getConnectedDevice(req.params.id);
        res.send(response);
    } catch (error) {
        next(new ApiError(500, error));
    }
});

module.exports = devicesRouter;
