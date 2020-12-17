const express = require("express");
const Protocol = require("../../controller/Automation/Protocol");
const Settings = require("../../controller/Automation/Settings");
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
    res.send(await Protocol.exportDeviceState());
});

automationRouter.get("/go", async (req, res, next) => {
    try {
        const response = await Protocol.storeGo();
        res.send();
    } catch (error) {
        next(new ApiError(500, error));
    }
});

automationRouter.get("/return", async (req, res) => {
    try {
        const response = await Protocol.storeReturn();
        res.send();
    } catch (error) {
        next(new ApiError(500, error));
    }
});

automationRouter.get("/settings", async (req, res) => {
    try {
        const response = await Settings.getAll();
        res.send(response);
    } catch (error) {
        next(new ApiError(500, error));
    }
});

automationRouter.get("/settings/:id", async (req, res, next) => {
    try {
        const response = await Settings.getById(req.params.id);
        res.send(response);
    } catch (error) {
        next(new ApiError(500, error));
    }
});

module.exports = automationRouter;
