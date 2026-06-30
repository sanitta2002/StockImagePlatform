import { ForgotPasswordRequestDTO } from "../dtos/auth/req/ForgotPasswordRequestDTO";

export interface IForgotPasswordUseCase {
  execute(dto: ForgotPasswordRequestDTO): Promise<void>;
}