import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

export async function getEmailTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || process.env.ETHEREAL_HOST || "smtp.ethereal.email";
  const port = Number(process.env.SMTP_PORT || process.env.ETHEREAL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.ETHEREAL_USER;
  const pass = process.env.SMTP_PASS || process.env.ETHEREAL_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "SMTP credentials are missing. Set SMTP_USER/SMTP_PASS (or ETHEREAL_USER/ETHEREAL_PASSWORD)."
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.verify();
  console.log("SMTP connection verified successfully");
  return transporter;
}
