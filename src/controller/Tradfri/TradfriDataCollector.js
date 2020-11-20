const PresistentStorage = require("../Storage/PersistentStorage");
const { emitter: tradfriEmitter } = require("../Tradfri/Tradfri");

const collectData = () => {
    tradfriEmitter.on("tradfri-device-update", (device) => {
        try {
            PresistentStorage.storeDeviceState(device);
        } catch (err) {
            console.log("Tradfri data collection failed", err);
        }
    });
};

module.exports = {
    collectData: collectData,
};
