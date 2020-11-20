const { connect: connectTradfri } = require("../controller/Tradfri/Tradfri");
const {
    collectData: collectDataTradfri,
} = require("../controller/Tradfri/TradfriDataCollector");

const {
    connect: connectWS,
} = require("../controller/WebsocketServer/WebsocketServer");

connectTradfri();
collectDataTradfri();
connectWS();
