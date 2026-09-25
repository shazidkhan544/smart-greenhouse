function getSoilStatus(soil) {

    if (soil >= 0 && soil <= 30) {
        return {
            status: "Dry",
            bangla: "শুকনা"
        };
    }

    if (soil >= 31 && soil <= 60) {
        return {
            status: "Moist",
            bangla: "মাঝারি আর্দ্র"
        };
    }

    if (soil >= 61 && soil <= 100) {
        return {
            status: "Wet",
            bangla: "ভেজা"
        };
    }

    return {
        status: "Unknown",
        bangla: "অজানা"
    };
}

module.exports = { getSoilStatus };