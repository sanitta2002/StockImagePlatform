
import { RefreshTokenResponseDTO } from "../dtos/auth/res/RefreshTokenResponseDTO";

export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<RefreshTokenResponseDTO>;
}