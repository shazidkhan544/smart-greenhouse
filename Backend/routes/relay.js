const express = require('express');
const router = express.Router();

const { sendCommand } = require('../serial');
const relayState = require('../relayState');

const commandMap = {
    pump: {
        on: "PUMP_ON",
        off: "PUMP_OFF"
    },

    fan: {
        on: "FAN_ON",
        off: "FAN_OFF"
    },

    light: {
        on: "LIGHT_ON",
        off: "LIGHT_OFF"
    }
};


// GET relay status
router.get('/status', (req, res) => {

    res.json(relayState);

});


// POST relay ON/OFF
router.post('/:device', (req, res) => {

    const device = req.params.device;
    const state = req.body.state;

    // Validation
    if (
        !commandMap[device] ||
        !["on", "off"].includes(state)
    ) {

        return res.status(400).json({
            error: "Invalid device or state"
        });

    }

    // Send command
    sendCommand(commandMap[device][state]);

    // Update state
    relayState[device] = state;

    res.json({
        device: device,
        state: state,
        message: "Command sent"
    });

});

module.exports = router;