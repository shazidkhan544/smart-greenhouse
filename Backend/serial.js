function sendCommand(command) {
    console.log(`[SERIAL] Sending command to Arduino: ${command}`);
}

module.exports = { sendCommand };