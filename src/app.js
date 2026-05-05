const express = require("express");
const app = express();

app.use(express.json());

// routes
app.use("/api/auth", require("./modules/auth/auth.routes"));

module.exports = app;
