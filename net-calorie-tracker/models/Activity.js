const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  date: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  metValue: { type: Number, required: true },
  duration: { type: String, required: true },
  calorieOut: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Activity", activitySchema);
