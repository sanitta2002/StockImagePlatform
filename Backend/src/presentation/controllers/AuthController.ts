import { RegisterUserRequestDTO } from "@/application/dtos/auth/req/RegisterUserRequestDTO";
import { LoginRequestDTO } from "@/application/dtos/auth/req/LoginRequestDTO";
import { IRegisterUserUseCase } from "@/application/interfaces/IRegisterUserUseCase";
import { ILoginUserUseCase } from "@/application/interfaces/ILoginUserUseCase";
import { HTTP_STATUS } from "@/domain/constants/HttpStatus";
import { USER_MESSAGE } from "@/domain/constants/Messages";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { env } from "@/config/envValidation";
import { IRefreshTokenUseCase } from "@/application/interfaces/IRefreshTokenUseCase";
import { IForgotPasswordUseCase } from "@/application/interfaces/IForgotPasswordUseCase";
import { ForgotPasswordRequestDTO } from "@/application/dtos/auth/req/ForgotPasswordRequestDTO";
import { IResetPasswordUseCase } from "@/application/interfaces/IResetPasswordUseCase";
import { ResetPasswordRequestDTO } from "@/application/dtos/auth/req/ResetPasswordRequestDTO";

@injectable()
export class AuthController {
  constructor(
    @inject("IRegisterUserUseCase")
    private readonly _registerUserUseCase: IRegisterUserUseCase,
    @inject("ILoginUserUseCase")
    private readonly _loginUserUseCase: ILoginUserUseCase,
    @inject("IRefreshTokenUseCase")
    private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    @inject("IForgotPasswordUseCase")
    private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,
    @inject("IResetPasswordUseCase")
    private readonly _resetPasswordUseCase: IResetPasswordUseCase,
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto: RegisterUserRequestDTO = req.body;
      const result = await this._registerUserUseCase.execute(dto);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: USER_MESSAGE.USER_REGISTERED,
        data: result,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto: LoginRequestDTO = req.body;
      const result = await this._loginUserUseCase.execute(dto);
      res
        .cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: env.REFRESH_TOKEN_MAX_AGE,
        })
        .status(HTTP_STATUS.OK)
        .json({
          success: true,
          message: USER_MESSAGE.USER_LOGGED_IN,
          data: result,
        });
    } catch (error: unknown) {
      next(error);
    }
  };
  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error(USER_MESSAGE.INVALID_TOKEN);
      }
      const result = await this._refreshTokenUseCase.execute(refreshToken);
      res
        .cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: env.REFRESH_TOKEN_MAX_AGE,
        })
        .status(HTTP_STATUS.OK)
        .json({
          success: true,
          message: USER_MESSAGE.USER_LOGGED_IN,
          data: result,
        });
    } catch (error: unknown) {
      next(error);
    }
  };
  logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.clearCookie("refreshToken").status(HTTP_STATUS.OK).json({
        success: true,
        message: USER_MESSAGE.LOGOUT_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  };
  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto: ForgotPasswordRequestDTO = req.body;
      await this._forgotPasswordUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: USER_MESSAGE.PASSWORD_RESET_LINK_SENT,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto: ResetPasswordRequestDTO = req.body;
      await this._resetPasswordUseCase.execute(dto);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: USER_MESSAGE.PASSWORD_RESET_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  };
}
