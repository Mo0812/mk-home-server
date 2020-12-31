const axios = require("axios");
const logger = require("../../system/Logger/Logger");
const ruleState = require("./RuleState");
const services = require("../Devices/Devices");
const serviceType = require("../Devices/DeviceType");
const { devices: tradfriDevices } = require("../Tradfri/Tradfri");

const enabled = parseInt(process.env.AUTOMATION_ENABLED) == 1;
const requestIntervalDelay = process.env.AUTOMATION_REQUEST_INTERVAL || 60000;
var requestInterval = null;

const _getTradfriDeviceForRuleState = (ruleState) => {
    return tradfriDevices[ruleState.instanceID];
};

const _getCurrentTime = () => {
    const currentDate = new Date();
    return currentDate.getHours() + ":" + currentDate.getMinutes();
};

const _getCurrentWeekday = () => {
    const currentDate = new Date();
    const weekday = currentDate.getDay();
    const weekdayTranslation = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return weekdayTranslation[weekday];
};

const getAutomationState = async (ruleState) => {
    try {
        // Get mkha instance from connected device list
        const mkhaInstances = await services.getConnectedDevices(
            serviceType.mkha
        );
        // Check if at least one instance is available
        if (mkhaInstances.length == 0) {
            throw new Error("No mkha instance configured");
        }
        const mkha = mkhaInstances[0];

        // Prepare the automation prediction request
        const url = mkha.ip_addr + ":" + mkha.port;
        const ruleDevice = _getTradfriDeviceForRuleState(ruleState);
        const body = {
            instanceid: ruleState.instanceID,
            type: ruleDevice.type,
            weekday: _getCurrentWeekday(),
            time: _getCurrentTime(),
        };

        // Request the prediction and return it
        const response = await axios({
            method: "POST",
            url: `http://${url}/predict`,
            data: body,
        });
        if (response.status == 200) {
            return response.data;
        } else {
            throw new Error("API request not responded correctly");
        }
    } catch (error) {
        logger.log("error", "Automation/Automator: " + error.message);
        throw error;
    }
};

const start = () => {
    if (enabled && requestInterval == null) {
        logger.log("info", "Automation/Automator: Starting request interval");
        requestInterval = setInterval(async () => {
            const ruleStates = await ruleState.getActiveRuleStates();
            for (const rState of ruleStates) {
                try {
                    const decision = await getAutomationState(rState);
                    logger.log("info", decision);
                    var device = _getTradfriDeviceForRuleState(rState);
                    device = device.lightList
                        ? device.lightList[0]
                        : device.plugList[0];
                    /*if (decision.onoff) {
                        device.turnOn();
                    } else {
                        device.turnOff();
                    }*/
                } catch (error) {
                    logger.log(
                        "error",
                        `Automation/Automator: No prediction possible for ${rState.instanceID}`
                    );
                }
            }
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
