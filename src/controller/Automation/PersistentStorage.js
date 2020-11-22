const mysql = require("mysql");
const { Parser } = require("json2csv");

const connectionCredentials = {
    host: process.env.MARIADB_HOST,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PW,
    database: process.env.MARIADB_DB,
    port: process.env.MARIADB_PORT,
};

function storeDeviceState(device) {
    if (device.lightList && device.lightList[0]) {
        var dbHandler = mysql.createConnection(connectionCredentials);
        dbHandler.connect(function (err) {
            if (err) {
                console.error("MySQL Connection failed", err);
            }
        });
        dbHandler.query(
            `INSERT INTO device_protocol (instanceID, type, lastSeen, onOff, color, dimmer) VALUES (${device.instanceId}, ${device.type}, ${device.lastSeen}, ${device.lightList[0].onOff}, "${device.lightList[0].color}", ${device.lightList[0].dimmer});`
        );
        dbHandler.end((err) => {
            if (err) {
                console.error("MySQL Connection could not be closed", err);
            }
        });
    }
}

function parseCSV(data, fields) {
    fields = fields.map((item) => item.name);
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    return csv;
}

const exportDeviceState = () => {
    var dbHandler = mysql.createConnection(connectionCredentials);
    dbHandler.connect(function (err) {
        if (err) {
            console.error("MySQL Connection failed", err);
        }
    });
    const promise = new Promise((resolve, reject) => {
        dbHandler.query(
            `SELECT * FROM device_protocol ORDER BY protocolTime;`,
            (err, result, fields) => {
                if (err) {
                    console.error("MySQL Select Statement failed");
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
    dbHandler.end((err) => {
        if (err) {
            console.error("MySQL Connection could not be closed", err);
        }
    });
    return promise;
};

module.exports = {
    storeDeviceState: storeDeviceState,
    exportDeviceState: exportDeviceState,
};
