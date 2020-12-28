const logger = require("../system/Logger/Logger");
const tradfri = require("../controller/Tradfri/Tradfri");
const tradfriDataCollector = require("../controller/Tradfri/TradfriDataCollector");
const mkhtSocket = require("../controller/MKHTemp/MKHTSocket");
const automator = require("../controller/Automation/Automator");
const {
    connect: connectWS,
} = require("../system/WebsocketServer/WebsocketServer");

tradfri.connect();
tradfriDataCollector.collectData();
mkhtSocket.connectAll();
connectWS();
automator.start();

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
