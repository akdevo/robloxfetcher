const express = require("express");
const axios = require("axios");
const app = express();

app.get("/followers/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const response = await axios.get(`https://friends.roblox.com/v1/users/${userId}/followers/count`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch follower count" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
