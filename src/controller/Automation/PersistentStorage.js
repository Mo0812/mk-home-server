const db = require("../Database/Database");
const { Parser } = require("json2csv");
const logger = require("../Logger/Logger");

function storeDeviceState(device) {
    return new Promise((resolve, reject) => {
        if (device.lightList && device.lightList[0]) {
            db.query(
                `INSERT INTO device_protocol (instanceID, type, lastSeen, onOff, color, dimmer) VALUES (${device.instanceId}, ${device.type}, ${device.lastSeen}, ${device.lightList[0].onOff}, "${device.lightList[0].color}", ${device.lightList[0].dimmer});`,
                (err, res) => {
                    if (err) {
                        logger.log(
                            "error",
                            "MySQL statement failed: " + err.message
                        );
                        reject(err);
                    }
                    resolve(res);
                }
            );
        } else {
            reject(new Error("No device object provided"));
        }
    });
}

/**
 *
 * @param {array} data
 * @param {array} fields
 */
function parseCSV(data, fields) {
    fields = fields.map((item) => item.name);
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    return csv;
}

const exportDeviceState = () => {
    const promise = new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM device_protocol ORDER BY protocolTime;`,
            (err, result, fields) => {
                if (err) {
                    logger.log(
                        "error",
                        "MySQL Select Statement failed: " + err.message
                    );
                    reject(err);
                }
                try {
                    const csv = parseCSV(
                        result.map((v) => Object.assign({}, v)),
                        fields
                    );

                    resolve(csv);
                } catch (err) {
                    reject(err);
                }
            }
        );
    });
    return promise;
};

function storeGo(userId = null) {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO people_protocol (userId, type) VALUES (${userId}, 'go');`,
            (err, res) => {
                if (err) {
                    logger.log(
                        "error",
                        "MySQL statement failed: " + err.message
                    );
                    reject(err);
                }
                resolve(res);
            }
        );
    });
}

function storeReturn(userId = null) {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO people_protocol (userId, type) VALUES (${userId}, 'return');`,
            (err, res) => {
                if (err) {
                    logger.log(
                        "error",
                        "MySQL statement failed: " + err.message
                    );
                    reject(err);
                }
                resolve(res);
            }
        );
    });
}

module.exports = {
    storeDeviceState: storeDeviceState,
    exportDeviceState: exportDeviceState,
    storeGo: storeGo,
    storeReturn: storeReturn,
};
