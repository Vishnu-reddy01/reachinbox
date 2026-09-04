import { getEmailTransporter } from "../config/email.js";
import nodemailer from "nodemailer";

async function testEmail() {
  const transporter = await getEmailTransporter();

  const info = await transporter.sendMail({
    from: '"ReachInbox Test" <test@reachinbox.dev>',
    to: "recipient@example.com",
    subject: "ReachInbox Scheduler Test",
    text: "This is a test email from the ReachInbox scheduler.",
    html: "<h2>ReachInbox Scheduler Test</h2><p>This email was sent successfully.</p>",
  });

  console.log("Email sent successfully!");
  console.log("Message ID:", info.messageId);

  const previewUrl = nodemailer.getTestMessageUrl(info);

  if (previewUrl) {
    console.log("Ethereal Preview URL:", previewUrl);
  }
}

testEmail().catch((error) => {
  console.error("Email test failed:", error);
  process.exit(1);
});