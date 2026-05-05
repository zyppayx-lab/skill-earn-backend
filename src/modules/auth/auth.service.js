const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const pool = require("../../config/db");
const sendEmail = require("../../config/resend");

const generateReferralCode = () => {
  return "SE-" + Math.random().toString(36).substring(2, 8);
};

// ✅ REGISTER
exports.register = async ({ name, email, password }) => {
  // check if user exists
  const existing = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existing.rows.length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await pool.query(
    `INSERT INTO users (id, name, email, password, referral_code)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, referral_code`,
    [
      uuidv4(),
      name,
      email,
      hashedPassword,
      generateReferralCode()
    ]
  );

  // send verification email
  await sendEmail({
    to: email,
    subject: "Verify your SkillEarn account",
    html: `<h3>Welcome to SkillEarn</h3>
           <p>Please verify your email to continue.</p>`
  });

  return user.rows[0];
};

// ✅ LOGIN
exports.login = async ({ email, password }) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  await sendEmail({
    to: email,
    subject: "New Login Alert",
    html: `<p>You just logged into SkillEarn</p>`
  });

  return user;
};
