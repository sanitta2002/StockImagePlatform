import { IMailService } from "@/domain/interfaces/services/IMailService";
import { injectable } from "tsyringe";
import nodemailer from "nodemailer";

@injectable()
export class MailService implements IMailService {
    private transporter =nodemailer.createTransport({
       service: "Gmail",
       auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASSWORD,
       },
    });
    async sendResetPasswordEmail(email: string, resetLink: string): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                    <p>This link expires in 15 minutes.</p>`,
        });
    }
}