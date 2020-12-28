const axios = require("axios");
const logger = require("../../system/Logger/Logger");
const ruleState = require("./RuleState");
const services = require("../Devices/Devices");
const serviceType = require("../Devices/DeviceType");

const enabled = parseInt(process.env.AUTOMATION_ENABLED) == 1;
const requestIntervalDelay = process.env.AUTOMATION_REQUEST_INTERVAL || 30000;
var requestInterval = null;

const getAutomationState = async (ruleState) => {
    try {
        const mkhaInstances = await services.getConnectedDevices(
            serviceType.mkha
        );
        if (mkhaInstances.length == 0) {
            throw new Error("No mkha instance configured");
        }
        const mkha = mkhaInstances[0];
        // TODO: Fetch with axios
    } catch (error) {
        logger.log("error", "Automation/Automator:", error.message);
    }
};

const start = () => {
    if (enabled && requestInterval == null) {
        logger.log("info", "Automation/Automator: Starting request interval");
        requestInterval = setInterval(async () => {
            console.log(await ruleState.getRuleState(1));
            console.log(await ruleState.getAllRuleStates());
        }, requestIntervalDelay);
    }
};

const stop = () => {
    logger.log("info", "Automation/Automator: Stopping request interval");
    clearInterval(requestInterval);
    requestInterval = null;
};

const restart = () => {
    stop();
    start();
};

module.exports = {
    start,
    stop,
    restart,
};
