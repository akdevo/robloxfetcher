require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.API_KEY;
const PLACE_ID = process.env.PLACE_ID;
const DATASTORE_NAME = process.env.DATASTORE_NAME;

const DATASTORE_URL = `https://apis.roblox.com/datastores/v1/universes/${PLACE_ID}/standard-datastores/datastore/entries/entry?datastoreName=${DATASTORE_NAME}&entryKey=AllPlayers`;
const NOTIFY_URL = "https://apis.roblox.com/user-notifications/v1/send";

async function fetchLastLoginTimes() {
    try {
        const response = await axios.get(DATASTORE_URL, {
            headers: { 'x-api-key': API_KEY }
        });

        return JSON.parse(response.data);
    } catch (error) {
        console.error("Error fetching last login data:", error.response?.data || error.message);
        return {};
    }
}

async function sendNotification(userId, daysInactive) {
    const notification = {
        userId: userId,
        payload: {
            messageId: "bd69d520-0818-044b-980d-a6a709239ca4",
            type: "MOMENT",
            parameters: { ["days-inactive"]: { stringValue: String(daysInactive) } }
        }
    };

    try {
        const response = await axios.post(NOTIFY_URL, notification, {
            headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' }
        });

        console.log(`Notification sent to ${userId}`);
    } catch (error) {
        console.error(`Failed to send notification to ${userId}:`, error.response?.data || error.message);
    }
}

async function checkInactivePlayers() {
    console.log("Checking for inactive players...");

    const playerData = await fetchLastLoginTimes();
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    for (const [userId, lastLogin] of Object.entries(playerData)) {
        const daysInactive = Math.floor((currentTime - lastLogin) / 86400);

        if (daysInactive >= 1) {
            console.log(`User ${userId} inactive for ${daysInactive} days, sending notification...`);
            await sendNotification(userId, daysInactive);
        } else {
            console.log(`User ${userId} is still active.`);
        }
    }
}

// Run the check every hour
setInterval(checkInactivePlayers, 3600000);
checkInactivePlayers();
