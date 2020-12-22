const logger = require("../system/Logger/Logger");
const { connect: connectTradfri } = require("../controller/Tradfri/Tradfri");
const {
    collectData: collectDataTradfri,
} = require("../controller/Tradfri/TradfriDataCollector");

const {
    connect: connectWS,
} = require("../system/WebsocketServer/WebsocketServer");
const mkhtSocket = require("../controller/MKHTemp/MKHTSocket");

connectTradfri();
collectDataTradfri();
connectWS();
mkhtSocket.connect();

/** MKHT Repair connection */
var mkhtReconnectInterval = null;
mkhtSocket.emitter.on("mkht_error", () => {
    if (mkhtReconnectInterval == null) {
        mkhtReconnectInterval = setInterval(() => {
            logger.log("info", "StartupService: Try reconnect to MKHTSocket");
            mkhtSocket.connect();
        }, 30000);
    }
});

mkhtSocket.emitter.on("mkht_connect", () => {
    logger.log("info", "StartupService: Successful reconnect to MKHTSocket");
    clearInterval(mkhtReconnectInterval);
    mkhtReconnectInterval = null;
});
