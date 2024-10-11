const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const userRoutes = require("./routes/users");
const activityRoutes = require("./routes/activities");
const foodRoutes = require("./routes/foods");

app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/foods", foodRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const excelRoutes = require("./routes/excel");
app.use("/api/excel", excelRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
