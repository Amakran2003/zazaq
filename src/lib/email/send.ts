import { Resend } from "resend";
import nodemailer from "nodemailer";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

const provider = process.env.EMAIL_PROVIDER || "resend";

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  const sender = from || "Zazaq <noreply@zazaq.fr>";

  if (provider === "mailpit") {
    const transport = nodemailer.createTransport({
      host: process.env.MAILPIT_HOST || "localhost",
      port: Number(process.env.MAILPIT_PORT || 1025),
      secure: false,
    });
    await transport.sendMail({ from: sender, to, subject, html });
    return { id: `mailpit-${Date.now()}` };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({ from: sender, to, subject, html });
  if (error) throw new Error(error.message);
  return { id: data?.id };
}
