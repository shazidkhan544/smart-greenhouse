const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./greenhouse.db', (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('SQLite database connected');
    }
});


// ========================================
// Create Readings Table
// ========================================

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            soil INTEGER,
            temperature REAL,
            humidity REAL,
            light INTEGER,
            timestamp TEXT
        )
    `, (err) => {

        if (err) {
            console.error('Table creation failed:', err.message);
        } else {
            console.log('Readings table ready');
        }

    });

});


// ========================================
// Insert Reading
// ========================================

function insertReading(soil, temperature, humidity, light) {

    const timestamp = new Date().toISOString();

    db.run(
        `
        INSERT INTO readings
        (soil, temperature, humidity, light, timestamp)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            soil,
            temperature,
            humidity,
            light,
            timestamp
        ],
        function (err) {

            if (err) {
                console.error('Insert failed:', err.message);
                return;
            }

            console.log('Reading inserted. ID:', this.lastID);
        }
    );
}


// ========================================
// Export
// ========================================

module.exports = {
    db,
    insertReading
};