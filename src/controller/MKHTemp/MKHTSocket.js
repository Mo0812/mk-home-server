const WebSocket = require("ws");
const events = require("events");
const logger = require("../../system/Logger/Logger");

var mkhtEmitter = new events.EventEmitter();

const connect = () => {
    const url = "ws://localhost:4001";
    const connection = new WebSocket(url);

    connection.on("open", () => {
        mkhtEmitter.emit("mkht-connection-ok");
        logger.log("info", "MKHTSocket: Connect to MKHT");
    });

    connection.on("error", (error) => {
        logger.log("error", "MKHTSocket Error: " + error);
        mkhtEmitter.emit("mkht-connection-error", error);
    });

    connection.on("message", async (e) => {
        mkhtEmitter.emit("mkht-update", e.data);
    });

    connection.on("close", () => {
        logger.log("error", "MKHTSocket Error: Connection closed");
        mkhtEmitter.emit("mkht-connection-error");
    });
};

module.exports = {
    emitter: mkhtEmitter,
    connect,
};
