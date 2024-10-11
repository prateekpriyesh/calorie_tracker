const express = require("express");
const { foodData, activityData } = require("../excelReader");
const router = express.Router();

router.get("/foods", (req, res) => {
  const { search = "", limit = 50 } = req.query;
  const filteredFoods = foodData
    .filter(food => food.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, parseInt(limit));

  res.json(filteredFoods);
});

router.get("/activities", (req, res) => {
  res.json(activityData);
});

module.exports = router;
