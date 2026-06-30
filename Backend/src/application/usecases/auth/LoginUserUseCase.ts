import { LoginRequestDTO } from "@/application/dtos/auth/req/LoginRequestDTO";
import { LoginResponseDTO } from "@/application/dtos/auth/res/LoginResponseDTO";
import { ILoginUserUseCase } from "@/application/interfaces/ILoginUserUseCase";
import { IUserRepository } from "@/domain/interfaces/repositories/IUserRepository";
import { IPasswordHasher } from "@/domain/interfaces/services/IPasswordHasher";
import { IJwtService } from "@/domain/interfaces/services/IJwtService";
import { USER_MESSAGE } from "@/domain/constants/Messages";
import { JwtPayload } from "@/domain/entities/IJwtPayload";
import { inject, injectable } from "tsyringe";

@injectable()
export class LoginUserUseCase implements ILoginUserUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("IPasswordHasher")
    private readonly _passwordHasher: IPasswordHasher,
    @inject("IJwtService")
    private readonly _jwtService: IJwtService
  ) {}

  async execute(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this._userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error(USER_MESSAGE.INVALID_CREDENTIALS);
    }
    const isPasswordValid = await this._passwordHasher.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error(USER_MESSAGE.INVALID_CREDENTIALS);
    }

    const payload: JwtPayload = {
      id: user.id as string,
      email: user.email,
    };

    const accessToken = this._jwtService.signAccessToken(payload);
    const refreshToken = this._jwtService.signRefreshToken(payload);
    console.log("**access Token:", accessToken);  
    console.log("**refresh Token:", refreshToken);
    return {
      accessToken,
      refreshToken,
      user: {
        id: payload.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
