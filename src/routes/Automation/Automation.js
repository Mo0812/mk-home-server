const express = require("express");
const PersistentStorage = require("../../controller/Automation/PersistentStorage");
const ApiError = require("../../helpers/Errors/ApiError");

const automationRouter = express.Router();

/**
 * @swagger
 * /export:
 *   get:
 *     description: Returns users
 *     tags:
 *      - Users
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: users
 */
automationRouter.get("/export", async (req, res) => {
    res.header("Content-Type", "text/csv");
    res.send(await PersistentStorage.exportDeviceState());
});

automationRouter.get("/go", async (req, res, next) => {
    try {
        const response = await PersistentStorage.storeGo();
        res.send();
    } catch (error) {
        next(new ApiError(500, error));
    }
});

automationRouter.get("/return", async (req, res) => {
    try {
        const response = await PersistentStorage.storeReturn();
        res.send();
    } catch (error) {
        next(new ApiError(500, error));
    }
});

module.exports = automationRouter;
