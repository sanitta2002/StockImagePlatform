export interface IMailService {
  sendResetPasswordEmail(
    email: string,
    resetLink: string
  ): Promise<void>;
}