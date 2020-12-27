const WebSocket = require("ws");
const events = require("events");
const logger = require("../../system/Logger/Logger");
const mkhtApi = require("./MKHTApi");

var mkhtEmitter = new events.EventEmitter();
var reconnecting = false;

const reconnect = (deviceId) => {
    if (!reconnecting) {
        reconnecting = true;
        setTimeout(() => {
            logger.log(
                "info",
                `MKHTSocket (${deviceId}): Try reconnect to MKHT with ID ${deviceId}`
            );
            connect(deviceId);
            reconnecting = false;
        }, 30000);
    }
};

const connect = async (deviceId) => {
    const connectedDevice = await mkhtApi.getDevice(deviceId);
    const url = `ws://${connectedDevice.ip_addr}:${connectedDevice.ws_port}`;
    const connection = new WebSocket(url);

    connection.on("open", () => {
        logger.log("info", `MKHTSocket (${deviceId}): Connect to MKHT`);
        reconnecting = false;
    });

    connection.on("error", (error) => {
        logger.log("error", `MKHTSocket Error (${deviceId}): ${error}`);
        reconnect(deviceId);
    });

    connection.on("message", async (e) => {
        mkhtEmitter.emit("mkht-update", e.data);
    });

    connection.on("close", () => {
        logger.log(
            "error",
            `MKHTSocket Error (${deviceId}): Connection closed`
        );
        reconnect(deviceId);
    });
};

const connectAll = async () => {
    const connectedDevices = await mkhtApi.getDevices();
    for (const device of connectedDevices) {
        connect(device.id);
    }
};

module.exports = {
    emitter: mkhtEmitter,
    connect,
    connectAll,
};
