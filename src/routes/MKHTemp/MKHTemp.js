const express = require("express");
const MKHTApi = require("../../controller/MKHTemp/MKHTApi");
const ApiError = require("../../helpers/Errors/ApiError");

const mkhtRouter = express.Router();

mkhtRouter.get("/current", async (req, res) => {
    try {
        const response = await MKHTApi.getCurrentData();
        res.send(response);
    } catch (error) {
        next(new ApiError(500, error));
    }
});

mkhtRouter.get("/all", async (req, res, next) => {
    try {
        const response = await MKHTApi.getAll();
        res.send(response);
    } catch (error) {
        next(new ApiError(500, error));
    }
});

module.exports = mkhtRouter;
