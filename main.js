const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Route to get the follower count of a user
app.get("/followers/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const response = await axios.get(`https://friends.roblox.com/v1/users/${userId}/followers/count`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch follower count" });
    }
});

// Function to check if one user follows another
async function isFollowing(followerId, targetId) {
    try {
        const url = `https://friends.roblox.com/v1/users/${followerId}/followings`;
        const response = await axios.get(url);

        // Check if targetId exists in the list
        return response.data.data.some(user => user.id == targetId);
    } catch (error) {
        console.error("Error fetching follow data:", error.message);
        return null; // Indicate failure
    }
}

// Route to check if a user follows another user
app.get("/isFollowing/:followerId/:targetId", async (req, res) => {
    const { followerId, targetId } = req.params;

    if (!followerId || !targetId) {
        return res.status(400).json({ error: "Invalid parameters" });
    }

    const follows = await isFollowing(followerId, targetId);

    if (follows === null) {
        return res.status(500).json({ error: "Failed to fetch follow status" });
    }

    res.json({ follows });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

