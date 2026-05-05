const authService = require("./auth.service");
const generateToken = require("../../utils/generateToken");

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);

    res.json({
      message: "User registered",
      token: generateToken(user)
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await authService.login(req.body);

    res.json({
      message: "Login successful",
      token: generateToken(user)
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
