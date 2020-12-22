const WebSocket = require("ws");
const events = require("events");
const logger = require("../../system/Logger/Logger");

var mkhtEmitter = new events.EventEmitter();

const connect = () => {
    const url = "ws://localhost:4001";
    const connection = new WebSocket(url);

    connection.on("open", () => {
        mkhtEmitter.emit("mkht_connect");
        logger.log("info", "MKHTSocket: Connect to MKHT");
    });

    connection.on("error", (error) => {
        logger.log("error", "MKHTSocket Error: " + error);
        mkhtEmitter.emit("mkht_error", error);
    });

    connection.on("message", async (e) => {
        mkhtEmitter.emit("mkht_update", e.data);
    });

    connection.on("close", () => {
        logger.log("error", "MKHTSocket Error: Connection closed");
        mkhtEmitter.emit("mkht_error");
    });
};

module.exports = {
    emitter: mkhtEmitter,
    connect,
};
