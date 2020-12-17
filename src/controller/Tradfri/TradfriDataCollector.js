const Protocol = require("../Automation/Protocol");
const { emitter: tradfriEmitter } = require("../Tradfri/Tradfri");
const logger = require("../../system/Logger/Logger");

const collectData = () => {
    tradfriEmitter.on("tradfri-device-update", async (device) => {
        try {
            if (process.env.NODE_ENV == "production") {
                await Protocol.storeDeviceState(device);
            }
        } catch (err) {
            logger.log(
                "error",
                "Tradfri data collection failed " + err.message
            );
        }
    });
};

module.exports = {
    collectData: collectData,
};
