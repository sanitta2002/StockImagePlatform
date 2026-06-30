import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "@/presentation/controllers/AuthController";
import { AUTH_ROUTES } from "@/domain/constants/Routes";

const authRouter = Router();

const authController = container.resolve(AuthController);

authRouter.post(AUTH_ROUTES.REGISTER, authController.register);
authRouter.post(AUTH_ROUTES.LOGIN, authController.login);
authRouter.post(AUTH_ROUTES.LOGOUT, authController.logout);
authRouter.post(AUTH_ROUTES.REFRESH, authController.refreshToken);
authRouter.post(AUTH_ROUTES.FORGOT_PASSWORD, authController.forgotPassword);
authRouter.post(AUTH_ROUTES.RESET_PASSWORD, authController.resetPassword);

export { authRouter };
