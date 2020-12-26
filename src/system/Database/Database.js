const mysql = require("mysql");
const logger = require("../Logger/Logger");

const connectionCredentials = {
    host: process.env.MARIADB_HOST,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PW,
    database: process.env.MARIADB_DB,
    port: process.env.MARIADB_PORT,
};

var connection;

const tryReconnection = () => {
    setTimeout(() => {
        logger.log("info", "MySQL: Try reconnect to MySQL DB");
        connect();
    }, 30000);
};

const connect = () => {
    connection = mysql.createConnection(connectionCredentials);
    connection.connect(function (err) {
        if (err) {
            logger.log("error", "MySQL connection failed: " + err.message);
            tryReconnection();
        } else {
            logger.log("info", "MySQL: Connection succeed");
        }
    });

    connection.on("error", (error) => {
        logger.log("error", "MySQL: " + error);
        if (error.fatal) {
            tryReconnection();
        }
    });
};

connect();

module.exports = connection;
