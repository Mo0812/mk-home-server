const winston = require("winston");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
});

if (process.env.LOG_CONSOLE) {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
            level: "error",
        })
    );
}
if (process.env.NODE_ENV == "production") {
    logger.add(
        new winston.transports.File({ filename: "error.log", level: "error" })
    );
    logger.add(new winston.transports.File({ filename: "app.log" }));
}

module.exports = logger;
