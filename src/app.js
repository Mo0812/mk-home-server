const path = require("path");

if (process.env.NODE_ENV == "production") {
    require("dotenv").config({
        path: path.resolve(__dirname, "../.env." + process.env.NODE_ENV),
    });
} else {
    require("dotenv").config();
}

require("./modules/expressServer");
require("./modules/startupServices");
