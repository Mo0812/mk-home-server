const mysql = require("mysql");

var dbHandler = mysql.createConnection({
    host: process.env.MARIADB_HOST,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PW,
    database: process.env.MARIADB_DB,
    port: process.env.MARIADB_PORT,
});

dbHandler.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

function storeState(device) {
    if (device.lightList && device.lightList[0]) {
        console.log(device.lightList[0].color);
        dbHandler.query(
            `INSERT INTO device_protocol (instanceID, type, lastSeen, onOff, color, dimmer) VALUES (${device.instanceId}, ${device.type}, ${device.lastSeen}, ${device.lightList[0].onOff}, "${device.lightList[0].color}", ${device.lightList[0].dimmer});`
        );
    }
}

module.exports = {
    handler: dbHandler,
    storeState: storeState,
};
