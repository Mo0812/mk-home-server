const db = require("../../system/Database/Database");
const logger = require("../../system/Logger/Logger");

const createSetting = (instanceId, mode) => {};

const removeSetting = (id) => {};

const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM automation_settings;`, (err, res) => {
            if (err) {
                logger.log("error", "MySQL statement failed: " + err.message);
                reject(err);
            }
            resolve(res);
        });
    });
};

const getById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM automation_settings WHERE id = ${id};`,
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
};

module.exports = {
    createSetting,
    removeSetting,
    getAll,
    getById,
};
