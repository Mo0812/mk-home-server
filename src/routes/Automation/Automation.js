const express = require("express");
const PersistentStorage = require("../../controller/Automation/PersistentStorage");

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

module.exports = automationRouter;
