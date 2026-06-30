import { ResetPasswordRequestDTO } from "@/application/dtos/auth/req/ResetPasswordRequestDTO";
import { IResetPasswordUseCase } from "@/application/interfaces/IResetPasswordUseCase";
import { USER_MESSAGE } from "@/domain/constants/Messages";
import { IUserRepository } from "@/domain/interfaces/repositories/IUserRepository";
import { IJwtService } from "@/domain/interfaces/services/IJwtService";
import { IPasswordHasher } from "@/domain/interfaces/services/IPasswordHasher";
import { inject, injectable } from "tsyringe";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("IJwtService") 
    private readonly _jwtService: IJwtService,
    @inject("IPasswordHasher")
    private readonly _passwordService: IPasswordHasher,
  ) {}

  async execute(dto: ResetPasswordRequestDTO): Promise<void> {
    const payload = this._jwtService.verifyResetToken(dto.token);
    
    if (!payload || !payload.id) {
      throw new Error(USER_MESSAGE.INVALID_TOKEN);
    }

    const user = await this._userRepository.findById(payload.id);
    if (!user) {
      throw new Error(USER_MESSAGE.USER_NOT_FOUND);
    }

    const hashedPassword = await this._passwordService.hash(dto.newPassword);
    
    await this._userRepository.update(user._id.toString(), {
      password: hashedPassword,
    });
  }
}
