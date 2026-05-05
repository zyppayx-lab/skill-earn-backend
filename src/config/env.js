require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  paystackKey: process.env.PAYSTACK_SECRET_KEY,
  resendKey: process.env.RESEND_API_KEY,
  appName: process.env.APP_NAME
};
