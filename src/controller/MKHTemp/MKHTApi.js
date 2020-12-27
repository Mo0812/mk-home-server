const axios = require("axios");
const moment = require("moment");
const devices = require("../Devices/Devices");

const getDevices = async () => {
    const connectedDevices = await devices.getConnectedDevices("mkht");
    return connectedDevices;
};

const getDevice = async (deviceId) => {
    const connectedDevice = await devices.getConnectedDevice(deviceId);
    return connectedDevice;
};

const getCurrentData = async (deviceId) => {
    const connectedDevice = await getDevice(deviceId);
    const url = connectedDevice.ip_addr + ":" + connectedDevice.port;
    try {
        let response = await axios({
            method: "GET",
            url: `http://${url}/dht/current`,
        });
        if (response.status == 200) {
            const data = Object.assign(connectedDevice, response.data);
            return data;
        }
    } catch (e) {
        throw new Error("MKHT API not reachable");
    }
};

const getAll = async (deviceId, duration = 1, unit = "days") => {
    const connectedDevice = await getDevice(deviceId);
    const url = connectedDevice.ip_addr + ":" + connectedDevice.port;
    const untilTimestamp = moment().subtract(duration, unit).unix();
    try {
        let response = await axios({
            method: "GET",
            url: `http://${url}/dht/all`,
            params: {
                until: untilTimestamp,
            },
        });
        if (response.status == 200) {
            connectedDevice.protocol = response.data;
            return connectedDevice;
        }
    } catch (e) {
        throw new Error("MKHT API not reachable");
    }
};

module.exports = {
    getDevice,
    getDevices,
    getCurrentData,
    getAll,
};
