const express = require('express');
const cors = require('cors');

require('./db');

const readingsRoutes = require('./routes/readings');
const relayRoutes = require('./routes/relay');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// Frontend
app.use(express.static('public'));


// Backend status
app.get('/api', (req, res) => {
    res.json({
        message: 'Smart Greenhouse Backend is running'
    });
});


// Sensor readings API
app.use('/api/readings', readingsRoutes);


// Relay control API
app.use('/api/relay', relayRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});