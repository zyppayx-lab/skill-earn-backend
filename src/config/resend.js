const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "SkillEarn <no-reply@skillearn.app>",
      to,
      subject,
      html
    });

    return response;
  } catch (error) {
    console.error("Email error:", error);
  }
};

module.exports = sendEmail;
