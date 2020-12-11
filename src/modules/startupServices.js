const { connect: connectTradfri } = require("../controller/Tradfri/Tradfri");
const {
    collectData: collectDataTradfri,
} = require("../controller/Tradfri/TradfriDataCollector");

const {
    connect: connectWS,
} = require("../system/WebsocketServer/WebsocketServer");

connectTradfri();
collectDataTradfri();
connectWS();
