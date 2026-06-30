import { IMailService } from "@/domain/interfaces/services/IMailService";
import { injectable } from "tsyringe";
import * as nodemailer from "nodemailer";

@injectable()
export class MailService implements IMailService {
  private transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  async sendResetPasswordEmail(
    email: string,
    resetLink: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset.</p>
        <p>Click the button below to reset your password.</p>

        <a href="${resetLink}"
           style="
             display:inline-block;
             padding:10px 20px;
             background:#2563eb;
             color:white;
             text-decoration:none;
             border-radius:6px;">
          Reset Password
        </a>

        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link expires in <strong>15 minutes</strong>.</p>
      `,
    });
  }
}
