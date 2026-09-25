const { sendCommand } = require('./serial');
const relayState = require('./relayState');


// Automation thresholds
const THRESHOLDS = {

    soilLow: 400,
    tempHigh: 30,
    lightLow: 300

};


function checkThresholds(reading) {

    // Soil low → Pump ON
    if (
        reading.soil < THRESHOLDS.soilLow &&
        relayState.pump === "off"
    ) {

        sendCommand("PUMP_ON");

        relayState.pump = "on";

        console.log("Automation: Soil low -> Pump ON");

    }


    // Temperature high → Fan ON
    if (
        reading.temperature > THRESHOLDS.tempHigh &&
        relayState.fan === "off"
    ) {

        sendCommand("FAN_ON");

        relayState.fan = "on";

        console.log("Automation: Temp high -> Fan ON");

    }


    // Light low → Grow Light ON
    if (
        reading.light < THRESHOLDS.lightLow &&
        relayState.light === "off"
    ) {

        sendCommand("LIGHT_ON");

        relayState.light = "on";

        console.log("Automation: Light low -> Grow light ON");

    }

}


module.exports = {
    checkThresholds
};