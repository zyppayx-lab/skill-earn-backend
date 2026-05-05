const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const pool = require("../../config/db");
const sendEmail = require("../../config/resend");

exports.register = async ({ name, email, password }) => {
  const existing = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existing.rows.length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const userId = uuidv4();

  await pool.query(
    `INSERT INTO users 
     (id, name, email, password, referral_code, verification_token)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [
      userId,
      name,
      email,
      hashedPassword,
      generateReferralCode(),
      verificationToken
    ]
  );

  // ✅ CREATE WALLET AUTOMATICALLY
  await pool.query(
    `INSERT INTO wallets (id, user_id) VALUES ($1,$2)`,
    [uuidv4(), userId]
  );

  const verifyLink = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

  await sendEmail({
    to: email,
    subject: "Verify your SkillEarn account",
    html: `
      <h2>Welcome to SkillEarn</h2>
      <p>Click below to verify your account:</p>
      <a href="${verifyLink}">Verify Account</a>
    `
  });

  return { message: "Check your email to verify account" };
};
