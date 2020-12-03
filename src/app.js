const path = require("path");
const logger = require("./controller/Logger/Logger");

try {
    if (process.env.NODE_ENV == "production") {
        const result = require("dotenv").config({
            path: path.resolve(__dirname, "../.env." + process.env.NODE_ENV),
        });
        if (result.error) {
            throw result.error;
        }
    } else {
        const result = require("dotenv").config();
        if (result.error) {
            throw result.error;
        }
    }
} catch (e) {
    logger.log("error", "ENV file not found");
    throw e;
}

require("./modules/expressServer");
require("./modules/startupServices");
