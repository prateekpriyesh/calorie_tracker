const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

router.get("/:userId", async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.params.userId });
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activity data:", error);
    res.status(500).json({ error: "Error fetching activity data" });
  }
});

router.post("/", async (req, res) => {
  const {
    date,
    name,
    description,
    metValue,
    duration,
    calorieOut,
    userId
  } = req.body;
  if (
    !date ||
    !name ||
    !description ||
    !metValue ||
    !duration ||
    !calorieOut ||
    !userId
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error("Error saving activity data:", error);
    res.status(500).json({ error: "Error saving activity data" });
  }
});

module.exports = router;
