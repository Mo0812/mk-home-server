const db = require("../../system/Database/Database");
const logger = require("../../system/Logger/Logger");

const createSetting = (instanceId, mode) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO automation_rules (instanceID, mode) VALUES (?, ?);`,
            [instanceId, mode],
            (error, result) => {
                if (error) {
                    logger.log("error", "Automation/Rules: " + error.message);
                    reject(error);
                }
                resolve(result.insertId);
            }
        );
    });
};

const removeSetting = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `DELETE FROM automation_rules WHERE id = ?;`,
            [id],
            (error, result) => {
                if (error) {
                    logger.log("error", "Automation/Rules: " + error.message);
                    reject();
                }
                resolve();
            }
        );
    });
};

const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM automation_rules;`, (err, res) => {
            if (err) {
                logger.log("error", "Automation/Rules MySQL: " + err.message);
                reject(err);
            }
            resolve(res);
        });
    });
};

const getById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM automation_rules WHERE id = ?;`,
            [id],
            (err, res) => {
                if (err) {
                    logger.log(
                        "error",
                        "Automation/Rules MySQL: " + err.message
                    );
                    reject(err);
                }
                resolve(res[0]);
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
