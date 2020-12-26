const events = require("events");
const logger = require("../../system/Logger/Logger");
const path = require("path");
const fs = require("fs");
const { stringify } = require("envfile");

const {
    TradfriClient,
    AccessoryTypes,
    discoverGateway,
    TradfriError,
    TradfriErrorCodes,
} = require("node-tradfri-client");

var { tradfri_user, tradfri_psk } = _loadCredentials();
const tradfri_securityCode = process.env.TRADFRI_SECURITYCODE;

const lightbulbs = {};
const plugs = {};
const devices = {};
const groups = {};

var tradfriEmitter = new events.EventEmitter();

const connect = async (withIP = false) => {
    const gateway = await discoverGateway();
    logger.log("info", gateway);
    const gatewayHost = withIP ? gateway.addresses[0] : gateway.name;

    const tradfri = new TradfriClient(gatewayHost);

    try {
        await tradfri.connect(tradfri_user, tradfri_psk);
        logger.log("info", "Tradfri: Connected with credentials");
        tradfriEmitter.emit("tradfri-gateway-connection-ok");

        tradfri.on("device updated", tradfri_deviceUpdated).observeDevices();

        tradfri
            .on("group updated", tradfri_groupUpdated)
            .observeGroupsAndScenes();
    } catch (initialError) {
        logger.log("error", "Tradfri: " + initialError.message);
        if (
            initialError instanceof TradfriError &&
            TradfriErrorCodes.ConnectionTimedOut &&
            !withIP
        ) {
            logger.log("error", "Tradfri: Try to reconnect with IP first");
            connect(true);
        }
        try {
            logger.log(
                "error",
                `Tradfri: Need to reauthentificate with security code: ${tradfri_securityCode}`
            );
            const { identity, psk } = await tradfri.authenticate(
                tradfri_securityCode
            );
            tradfri_user = identity;
            tradfri_psk = psk;

            _storeCredentials(identity, psk);

            connect(true);
        } catch (authError) {
            logger.log("error", authError.message);
            tradfriEmitter.emit("tradfri-gateway-connection-error");
        }
    }
};

function tradfri_deviceUpdated(device) {
    devices[device.instanceId] = device;
    if (device.type === AccessoryTypes.lightbulb) {
        lightbulbs[device.instanceId] = device;
    } else if (device.type === AccessoryTypes.plug) {
        plugs[device.instanceId] = device;
    }

    tradfriEmitter.emit("tradfri-device-update", device);
}

function tradfri_groupUpdated(group) {
    groups[group.instanceId] = group;
    tradfriEmitter.emit("tradfri-group-update");
}

function tradfri_logger(message, severity) {
    logger.log({
        level: severity,
        message: message,
    });
}

function _loadCredentials() {
    var credentials = require("dotenv").config({
        path: path.resolve(__dirname, "../../../.tradfri-credentials"),
    });
    if (credentials.error) {
        logger.log("error", credentials.error.message);
    }
    credentials = credentials.parsed;
    return {
        tradfri_user: credentials.TRADFRI_USER,
        tradfri_psk: credentials.TRADFRI_PSK,
    };
}

function _storeCredentials(identity, psk) {
    const newCredentials = {
        TRADFRI_USER: identity,
        TRADFRI_PSK: psk,
    };
    fs.writeFileSync(
        path.resolve(__dirname, "../../../.tradfri-credentials"),
        stringify(newCredentials)
    );
}

module.exports = {
    connect: connect,
    emitter: tradfriEmitter,
    lightbulbs: lightbulbs,
    plugs: plugs,
    devices: devices,
    groups: groups,
};
