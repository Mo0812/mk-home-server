// TODO: Rename to SERVICES
const db = require("../../system/Database/Database");
const logger = require("../../system/Logger/Logger");

const getConnectedDevices = (type = null) => {
    return new Promise((resolve, reject) => {
        var query = "SELECT * FROM connected_smarthome_devices;";
        var args = [];
        if (type) {
            query = "SELECT * FROM connected_smarthome_devices WHERE type = ?;";
            args = [type];
        }
        db.query(query, args, (error, result) => {
            if (error) {
                logger.log("error", "MySQL statement failed: " + error.message);
                reject(error);
            }
            resolve(result);
        });
    });
};

const getConnectedDevice = (deviceId) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM connected_smarthome_devices WHERE id = ?;",
            [deviceId],
            (error, result) => {
                if (error) {
                    logger.log(
                        "error",
                        "MySQL statement failed: " + error.message
                    );
                    reject(error);
                }
                resolve(result[0]);
            }
        );
    });
};

module.exports = {
    getConnectedDevices,
    getConnectedDevice,
};
