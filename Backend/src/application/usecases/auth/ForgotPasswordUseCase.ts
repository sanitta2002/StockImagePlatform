import { ForgotPasswordRequestDTO } from "@/application/dtos/auth/req/ForgotPasswordRequestDTO";
import { IForgotPasswordUseCase } from "@/application/interfaces/IForgotPasswordUseCase";
import { USER_MESSAGE } from "@/domain/constants/Messages";
import { IUserRepository } from "@/domain/interfaces/repositories/IUserRepository";
import { IJwtService } from "@/domain/interfaces/services/IJwtService";
import { IMailService } from "@/domain/interfaces/services/IMailService";
import { inject, injectable } from "tsyringe";

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("IJwtService") private readonly _jwtService: IJwtService,
    @inject("IMailService") private readonly _mailService: IMailService,
  ) {}
  async execute(dto: ForgotPasswordRequestDTO): Promise<void> {
    const user = await this._userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error(USER_MESSAGE.USER_NOT_FOUND);
    }
    const resetToken = this._jwtService.generateResetToken({ id: user.id as string, email: user.email });
    console.log(`***reset token : ${user.email}: ${resetToken}`);
    
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log("*********",resetLink);
    await this._mailService.sendResetPasswordEmail(user.email, resetLink);
  }
}
