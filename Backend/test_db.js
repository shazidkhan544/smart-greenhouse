const {
    insertReading,
    getLatestReading,
    getHistory
} = require('./db');


// Dummy sensor data
insertReading(450, 26.5, 60, 720);
insertReading(430, 27.0, 58, 700);
insertReading(410, 27.2, 55, 690);


// Wait for database insert
setTimeout(() => {

    getLatestReading((err, row) => {

        if (err) {
            console.error('Latest reading error:', err.message);
            return;
        }

        console.log('Latest:', row);

    });


    getHistory(5, (err, rows) => {

        if (err) {
            console.error('History error:', err.message);
            return;
        }

        console.log('History:', rows);

    });

}, 500);