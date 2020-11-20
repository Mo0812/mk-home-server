const mysql = require("mysql");

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

module.exports = {
    storeDeviceState: storeDeviceState,
};
