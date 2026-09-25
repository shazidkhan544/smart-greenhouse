// =====================================================
// Smart Greenhouse Dashboard
// =====================================================


// Backend URL
const API_URL = '';


// =====================================================
// Load Latest Sensor Reading
// =====================================================

async function loadLatestReading() {

    try {

        const response = await fetch(
            `${API_URL}/api/readings/latest`
        );


        if (!response.ok) {

            throw new Error(
                'Failed to fetch latest reading'
            );

        }


        const data = await response.json();


        console.log('Latest Reading:', data);


        // ==========================================
        // Soil Moisture
        // ==========================================

       document.getElementById('soil').textContent =
    data.soil.value + '%';


document.getElementById('soil-status').textContent =
    data.soil.status;


        // ==========================================
        // Temperature
        // ==========================================

        document.getElementById('temperature').textContent =
            data.temperature.value + ' °C';


        // ==========================================
        // Humidity
        // ==========================================

        document.getElementById('humidity').textContent =
            data.humidity.value + ' %';


        // ==========================================
        // Light
        // ==========================================

        document.getElementById('light').textContent =
            data.light.value + ' lux';


    } catch (error) {

        console.error(
            'Sensor data error:',
            error
        );

    }

}



// =====================================================
// Load Sensor History
// =====================================================

async function loadHistory() {

    try {

        const response = await fetch(
            `${API_URL}/api/readings/history?limit=10`
        );


        if (!response.ok) {

            throw new Error(
                'Failed to fetch history'
            );

        }


        const data = await response.json();


        console.log('History:', data);


        createHistoryChart(data);


    } catch (error) {

        console.error(
            'History error:',
            error
        );

    }

}



// =====================================================
// Create History Chart
// =====================================================

let historyChart = null;


function createHistoryChart(data) {

    const canvas =
        document.getElementById('historyChart');


    if (!canvas) {
        return;
    }


    // Database latest first.
    // Chart-এর জন্য reverse করছি।

    const readings = [...data].reverse();


    const labels = readings.map(
        (item, index) => {

            return `Reading ${index + 1}`;

        }
    );


    const soilData = readings.map(
        item => {

            return item.soil / 10;

        }
    );


    const temperatureData = readings.map(
        item => {

            return item.temperature;

        }
    );


    const humidityData = readings.map(
        item => {

            return item.humidity;

        }
    );


    // যদি আগের chart থাকে
    // তাহলে destroy করব।

    if (historyChart) {

        historyChart.destroy();

    }


    historyChart = new Chart(
        canvas,
        {

            type: 'line',

            data: {

                labels: labels,

                datasets: [

                    {
                        label: 'Soil Moisture (%)',

                        data: soilData,

                        borderWidth: 2,

                        tension: 0.3
                    },


                    {
                        label: 'Temperature (°C)',

                        data: temperatureData,

                        borderWidth: 2,

                        tension: 0.3
                    },


                    {
                        label: 'Humidity (%)',

                        data: humidityData,

                        borderWidth: 2,

                        tension: 0.3
                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: true,

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        }
    );

}



// =====================================================
// Get Relay Status
// =====================================================

async function loadRelayStatus() {

    try {

        const response = await fetch(
            `${API_URL}/api/relay/status`
        );


        if (!response.ok) {

            throw new Error(
                'Failed to fetch relay status'
            );

        }


        const data = await response.json();


        console.log(
            'Relay Status:',
            data
        );


        updateRelayButton(
            'pump',
            data.pump
        );


        updateRelayButton(
            'fan',
            data.fan
        );


        updateRelayButton(
            'light',
            data.light
        );


    } catch (error) {

        console.error(
            'Relay status error:',
            error
        );

    }

}



// =====================================================
// Toggle Relay
// =====================================================

async function toggleRelay(device) {

    const button =
        document.getElementById(
            `${device}-btn`
        );


    // Current state
    const currentState =
        button.textContent
            .trim()
            .toLowerCase();


    // OFF → ON
    // ON → OFF

    const newState =
        currentState === 'on'
            ? 'off'
            : 'on';


    try {

        const response = await fetch(
            `${API_URL}/api/relay/${device}`,
            {

                method: 'POST',

                headers: {

                    'Content-Type':
                        'application/json'

                },

                body: JSON.stringify({

                    state: newState

                })

            }
        );


        if (!response.ok) {

            throw new Error(
                'Relay command failed'
            );

        }


        const data =
            await response.json();


        console.log(
            'Relay response:',
            data
        );


        updateRelayButton(
            device,
            data.state
        );


    } catch (error) {

        console.error(
            'Relay error:',
            error
        );

        alert(
            'Relay control failed'
        );

    }

}



// =====================================================
// Update Relay Button
// =====================================================

function updateRelayButton(
    device,
    state
) {

    const button =
        document.getElementById(
            `${device}-btn`
        );


    if (!button) {
        return;
    }


    button.textContent =
        state.toUpperCase();


    if (state === 'on') {

        button.classList.add('on');

    } else {

        button.classList.remove('on');

    }

}



// =====================================================
// Initial Load
// =====================================================

loadLatestReading();

loadHistory();

loadRelayStatus();



// =====================================================
// Auto Refresh
// =====================================================

// প্রতি 5 second পর latest sensor data update হবে

setInterval(
    loadLatestReading,
    5000
);


// প্রতি 10 second পর history update হবে

setInterval(
    loadHistory,
    10000
);


// Relay status প্রতি 5 second পর check হবে

setInterval(
    loadRelayStatus,
    5000
);