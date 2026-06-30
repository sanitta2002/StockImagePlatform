import { RefreshTokenResponseDTO } from "@/application/dtos/auth/res/RefreshTokenResponseDTO";
import { IRefreshTokenUseCase } from "@/application/interfaces/IRefreshTokenUseCase";
import { ERROR_MESSAGES } from "@/domain/constants/errorMessages";
import { IJwtService } from "@/domain/interfaces/services/IJwtService";
import { inject, injectable } from "tsyringe";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    @inject("IJwtService") private readonly _jwtService: IJwtService,
  ) {}
  async execute(refreshToken: string): Promise<RefreshTokenResponseDTO> {
    const payload = this._jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    }

    const newAccessToken = this._jwtService.signAccessToken(payload);
    const newRefreshToken = this._jwtService.signRefreshToken(payload);
    console.log("**new access Token:", newAccessToken);
    console.log("**new refresh Token:", newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
