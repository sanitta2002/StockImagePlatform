import { JwtPayload } from "@/domain/entities/IJwtPayload";

export interface IJwtService {
  signAccessToken(payload: JwtPayload): string;
  signRefreshToken(payload: JwtPayload): string;
  verifyAccessToken(token: string): JwtPayload | null;
  verifyRefreshToken(token: string): JwtPayload | null;
  generateResetToken(payload: JwtPayload): string;
  verifyResetToken(token: string): JwtPayload | null;
}
