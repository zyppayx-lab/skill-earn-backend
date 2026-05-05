const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/env");
const { generateCode } = require("../../utils/generateCode");

// TEMP in-memory users (we replace with PostgreSQL later)
const users = [];

exports.register = async ({ email, password, name }) => {
  const existing = users.find(u => u.email === email);
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now().toString(),
    name,
    email,
    password: hashed,
    referralCode: generateCode(),
    createdAt: new Date()
  };

  users.push(user);

  return { message: "User registered", user };
};

exports.login = async ({ email, password }) => {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const token = jwt.sign({ id: user.id }, jwtSecret, {
    expiresIn: "7d"
  });

  return { token, user };
};
