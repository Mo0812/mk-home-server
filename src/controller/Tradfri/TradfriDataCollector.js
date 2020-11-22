const PresistentStorage = require("../Automation/PersistentStorage");
const { emitter: tradfriEmitter } = require("../Tradfri/Tradfri");

const collectData = () => {
    tradfriEmitter.on("tradfri-device-update", (device) => {
        try {
            if (process.env.NODE_ENV == "production") {
                PresistentStorage.storeDeviceState(device);
            }
        } catch (err) {
            console.log("Tradfri data collection failed", err);
        }
    });
};

module.exports = {
    collectData: collectData,
};
