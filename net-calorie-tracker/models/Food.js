const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  date: { type: String, required: true },
  name: { type: String, required: true },
  mealType: { type: String, required: true },
  foodGroup: { type: String, required: true },
  serving: { type: Number, required: true },
  calorieIn: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Food", foodSchema);
