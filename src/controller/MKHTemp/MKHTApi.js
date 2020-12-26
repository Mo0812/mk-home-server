const axios = require("axios");
const moment = require("moment");

const getCurrentData = async () => {
    try {
        let response = await axios({
            method: "GET",
            url: "http://localhost:8001/dht/current",
        });
        if (response.status == 200) {
            return response.data;
        }
    } catch (e) {
        throw new Error("MKHT API not reachable");
    }
};

const getAll = async (duration = 1, unit = "days") => {
    const untilTimestamp = moment().subtract(duration, unit).unix();
    try {
        let response = await axios({
            method: "GET",
            url: "http://localhost:8001/dht/all",
            params: {
                until: untilTimestamp,
            },
        });
        if (response.status == 200) {
            console.log(untilTimestamp);
            return response.data;
        }
    } catch (e) {
        throw new Error("MKHT API not reachable");
    }
};

module.exports = {
    getCurrentData,
    getAll,
};
