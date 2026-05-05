const express = require("express");

const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", require("./modules/auth/auth.routes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "SkillEarn API is running 🚀" });
});

module.exports = app;
