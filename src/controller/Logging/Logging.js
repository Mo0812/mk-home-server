const fs = require("fs");
const loggerConfig = require("../../system/Logger/LoggerConfig");

const _loadLog = (type) => {
    return new Promise((resolve, reject) => {
        var logPath = loggerConfig.appLogPath;
        if (type == "error") {
            logPath = loggerConfig.errorLogPath;
        }
        fs.readFile(logPath, "UTF-8", (err, data) => {
            if (err) {
                // TODO: Error handling
                reject(err);
            }
            const lines = data.split(/\r?\n/);
            const jsonLines = [];
            for (const line of lines) {
                if (line != "") {
                    const json = JSON.parse(line);
                    jsonLines.push(json);
                }
            }
            resolve(jsonLines);
        });
    });
};

const loadAppLog = () => {
    return _loadLog("app");
};

const loadErrorLog = () => {
    return _loadLog("error");
};

module.exports = {
    loadAppLog,
    loadErrorLog,
};
