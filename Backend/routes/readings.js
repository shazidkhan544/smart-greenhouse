const express = require('express');
const router = express.Router();

const { db } = require('../db');
console.log("DB OBJECT:", db);

const { checkThresholds } = require('../automation');
const { getSoilStatus } = require('../soilStatus');

// ========================================
// POST /api/readings
// Save new sensor reading
// ========================================

router.post('/', (req, res) => {

    const {
        soil,
        temperature,
        humidity,
        light
    } = req.body;

    const soilPercent = soil / 10;

    if (
        soil === undefined ||
        temperature === undefined ||
        humidity === undefined ||
        light === undefined
    ) {
        return res.status(400).json({
            error: 'soil, temperature, humidity and light are required'
        });
    }

    const sql = `
        INSERT INTO readings
        (soil, temperature, humidity, light)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [soil, temperature, humidity, light],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: 'Reading saved successfully',
                id: this.lastID
            });
        }
    );
});


// ========================================
// GET /api/readings/latest
// Get latest sensor reading
// ========================================

router.get('/latest', (req, res) => {

    db.get(
        `
        SELECT *
        FROM readings
        ORDER BY id DESC
        LIMIT 1
        `,
        [],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.json(null);
            }

            const soilPercent = row.soil / 10;

            const soilStatus = getSoilStatus(soilPercent);

            res.json({
                id: row.id,

                soil: {
                    value: soilPercent,
                    unit: "%",
                    status: soilStatus.status,
                    bangla: soilStatus.bangla
                },

                temperature: {
                    value: row.temperature,
                    unit: "°C"
                },

                humidity: {
                    value: row.humidity,
                    unit: "%"
                },

                light: {
                    value: row.light,
                    unit: "lux"
                },

                timestamp: row.timestamp
            });

        }
    );

});

// ========================================
// GET /api/readings/history?limit=20
// Get sensor history
// ========================================

router.get('/history', (req, res) => {

    let limit = parseInt(req.query.limit) || 20;

    if (limit > 100) {
        limit = 100;
    }

    if (limit < 1) {
        limit = 1;
    }

    db.all(
        `
        SELECT *
        FROM readings
        ORDER BY id DESC
        LIMIT ?
        `,
        [limit],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});


module.exports = router;