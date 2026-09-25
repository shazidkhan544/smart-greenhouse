const { checkThresholds } = require('./automation');


// Dummy sensor reading
const reading = {

    soil: 350,
    temperature: 32,
    humidity: 60,
    light: 250

};


// Run automation
checkThresholds(reading);