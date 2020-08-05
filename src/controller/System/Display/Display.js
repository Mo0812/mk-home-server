const { exec } = require("child_process");

class Display {
    constructor() {}

    async status() {
        const connected = await this.getConnectionInfo();
        if (connected) {
            try {
                const isOn = await this.getBacklightPower();
                const brightness = await this.getBrightness();
                const maxBrightness = await this.getMaxBrightness();
                const brightnessPercentage = brightness / maxBrightness;
                return {
                    display: {
                        connected: connected,
                        isOn: isOn,
                        brightness: {
                            current: brightness,
                            max: maxBrightness,
                            percentage: brightnessPercentage,
                        },
                    },
                };
            } catch (e) {
                return { display: { connected: true, error: e } };
            }
        } else {
            return { display: { connected: false } };
        }
    }

    async turnOnOff(isOn) {
        try {
            const value = isOn ? "echo 0" : "echo 1";
            await new Promise(async (resolve, reject) => {
                exec(
                    "sudo bash -c '" +
                        value +
                        " > /sys/devices/platform/rpi_backlight/backlight/rpi_backlight/bl_power'",
                    (error, stdout, stderr) => {
                        if (error || stderr) {
                            reject();
                        }
                        resolve();
                    }
                );
            });
        } catch (e) {
        } finally {
            return await this.status();
        }
    }

    async setBrightness(brightness) {
        try {
            await new Promise(async (resolve, reject) => {
                exec(
                    "sudo bash -c 'echo " +
                        brightness +
                        " > /sys/devices/platform/rpi_backlight/backlight/rpi_backlight/brightness'",
                    (error, stdout, stderr) => {
                        if (error || stderr) {
                            reject();
                        }
                        resolve();
                    }
                );
            });
        } catch (e) {
        } finally {
            return await this.status();
        }
    }

    getConnectionInfo() {
        return new Promise(async (resolve, reject) => {
            exec(
                "cat /proc/device-tree/rpi_backlight/status",
                (error, stdout, stderr) => {
                    if (error || stderr) {
                        resolve(false);
                    }
                    resolve(true);
                }
            );
        });
    }

    getBacklightPower() {
        return new Promise(async (resolve, reject) => {
            exec(
                "cat /sys/devices/platform/rpi_backlight/backlight/rpi_backlight/bl_power",
                (error, stdout, stderr) => {
                    if (error || stderr) {
                        reject(stderr);
                    }
                    resolve(stdout == 1 ? false : true);
                }
            );
        });
    }

    getBrightness() {
        return new Promise(async (resolve, reject) => {
            exec(
                "cat /sys/devices/platform/rpi_backlight/backlight/rpi_backlight/brightness",
                (error, stdout, stderr) => {
                    if (error || stderr) {
                        reject(stderr);
                    }
                    resolve(parseInt(stdout));
                }
            );
        });
    }

    getMaxBrightness() {
        return new Promise(async (resolve, reject) => {
            exec(
                "cat /sys/devices/platform/rpi_backlight/backlight/rpi_backlight/max_brightness",
                (error, stdout, stderr) => {
                    if (error || stderr) {
                        reject(stderr);
                    }
                    resolve(parseInt(stdout));
                }
            );
        });
    }
}

module.exports = Display;
