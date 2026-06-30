import jwt from "jsonwebtoken";
import { IJwtService } from "@/domain/interfaces/services/IJwtService";
import { JwtPayload } from "@/domain/entities/IJwtPayload";
import { ERROR_MESSAGES } from "@/domain/constants/errorMessages";
import { env } from "@/config/envValidation";

export class JwtService implements IJwtService {
  private readonly _ACCESS_SECRET: string;
  private readonly _REFRESH_SECRET: string;
  private readonly _RESET_SECRET: string;
  constructor() {
    this._ACCESS_SECRET = env.JWT_ACCESS_SECRET;
    this._REFRESH_SECRET = env.JWT_REFRESH_SECRET;
    this._RESET_SECRET = env.JWT_RESET_SECRET;
  }

  signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this._ACCESS_SECRET, { expiresIn: "30m" });
  }

  signRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this._REFRESH_SECRET, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this._ACCESS_SECRET) as JwtPayload;
    } catch {
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this._REFRESH_SECRET) as JwtPayload;
    } catch {
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }
  generateResetToken(payload: JwtPayload): string {
    try {
      return jwt.sign(payload, this._RESET_SECRET, { expiresIn: "1h" });
    } catch {
      throw new Error(ERROR_MESSAGES.TOKEN_GENERATION_FAILED);
    }
  }
  verifyResetToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this._RESET_SECRET) as JwtPayload;
    } catch {
      throw new Error(ERROR_MESSAGES.RESET_TOKEN_EXPIRED);
    }
  }
}
