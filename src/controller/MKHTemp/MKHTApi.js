const axios = require("axios");

const getCurrentData = async () => {
    try {
        let response = await axios({
            method: "GET",
            url: "http://localhost:8001/dht/current",
        });
        if (response.status == 200) {
            return response.data;
        }
    } catch (e) {}
};

const getAll = async (until = "1d") => {};

module.exports = {
    getCurrentData,
};
