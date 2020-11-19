const readline = require("readline");
const events = require("events");
const tradfriLib = require("node-tradfri-client");
// const PresistentStorage = require("./PersistentStorage");

const TradfriClient = tradfriLib.TradfriClient;
const AccessoryTypes = tradfriLib.AccessoryTypes;
const discoverGateway = tradfriLib.discoverGateway;

var tradfri_user = process.env.TRADFRI_USER;
var tradfri_psk = process.env.TRADFRI_PSK;

const lightbulbs = {};
const plugs = {};
const devices = {};
const groups = {};

var tradfriEmitter = new events.EventEmitter();

const connect = async () => {
    const gateway = await discoverGateway();
    const tradfri = new TradfriClient(gateway.name);

    try {
        await tradfri.connect(tradfri_user, tradfri_psk);

        tradfri.on("device updated", tradfri_deviceUpdated).observeDevices();

        tradfri
            .on("group updated", tradfri_groupUpdated)
            .observeGroupsAndScenes();
    } catch (initialError) {
        try {
            const prompt = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            prompt.question(
                "Your Tradfri Security Code:",
                async (securityCode) => {
                    const { identity, psk } = await tradfri.authenticate(
                        securityCode
                    );
                    tradfri_user = identity;
                    tradfri_psk = psk;
                    connect();
                }
            );
        } catch (authError) {
            console.error(initialError);
            console.error(authError);
        }
    }
};

function tradfri_deviceUpdated(device) {
    devices[device.instanceId] = device;
    // console.log(device);
    // PersistentStorage.storeState(device);
    if (device.type === AccessoryTypes.lightbulb) {
        lightbulbs[device.instanceId] = device;
    } else if (device.type === AccessoryTypes.plug) {
        plugs[device.instanceId] = device;
    }

    tradfriEmitter.emit("tradfri-device-update");
}

function tradfri_groupUpdated(group) {
    groups[group.instanceId] = group;
    tradfriEmitter.emit("tradfri-group-update");
}

module.exports = {
    connect: connect,
    emitter: tradfriEmitter,
    lightbulbs: lightbulbs,
    plugs: plugs,
    devices: devices,
    groups: groups,
};
