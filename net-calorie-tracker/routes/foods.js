const express = require("express");
const router = express.Router();
const Food = require("../models/Food");

router.get("/:userId", async (req, res) => {
  try {
    const foods = await Food.find({ userId: req.params.userId });
    res.status(200).json(foods);
  } catch (error) {
    console.error("Error fetching food data:", error);
    res.status(500).json({ error: "Error fetching food data" });
  }
});

router.post("/", async (req, res) => {
  const {
    date,
    name,
    mealType,
    foodGroup,
    serving,
    calorieIn,
    userId
  } = req.body;
  if (
    !date ||
    !name ||
    !mealType ||
    !foodGroup ||
    !serving ||
    !calorieIn ||
    !userId
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    console.error("Error saving food data:", error);
    res.status(500).json({ error: "Error saving food data" });
  }
});

module.exports = router;
