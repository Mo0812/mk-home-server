const logger = require("../system/Logger/Logger");
const tradfri = require("../controller/Tradfri/Tradfri");
const tradfriDataCollector = require("../controller/Tradfri/TradfriDataCollector");
const mkhtSocket = require("../controller/MKHTemp/MKHTSocket");
const {
    connect: connectWS,
} = require("../system/WebsocketServer/WebsocketServer");

connectWS();
tradfri.connect();
tradfriDataCollector.collectData();
mkhtSocket.connect();

/** Tradfri Repair connection */
var tradfriReconnectInterval = null;
tradfri.emitter.on("tradfri-gateway-connection-error", () => {
    if (tradfriReconnectInterval == null) {
        tradfriReconnectInterval = setInterval(() => {
            logger.log(
                "info",
                "StartupService: Try reconnect to Tradfri gatewqay"
            );
            tradfri.connect();
        }, 30000);
    }
});

tradfri.emitter.on("tradfri-gateway-connection-ok", () => {
    if (tradfriReconnectInterval != null) {
        logger.log(
            "info",
            "StartupService: Successful reconnect to Tradfri gateway"
        );
        clearInterval(tradfriReconnectInterval);
        tradfriReconnectInterval = null;
    }
});

/** MKHT Repair connection */
var mkhtReconnectInterval = null;
mkhtSocket.emitter.on("mkht-connection-error", () => {
    if (mkhtReconnectInterval == null) {
        mkhtReconnectInterval = setInterval(() => {
            logger.log("info", "StartupService: Try reconnect to MKHTSocket");
            mkhtSocket.connect();
        }, 30000);
    }
});

mkhtSocket.emitter.on("mkht-connection-ok", () => {
    if (mkhtReconnectInterval != null) {
        logger.log(
            "info",
            "StartupService: Successful reconnect to MKHTSocket"
        );
        clearInterval(mkhtReconnectInterval);
        mkhtReconnectInterval = null;
    }
});
