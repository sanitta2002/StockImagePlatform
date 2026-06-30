import { ResetPasswordRequestDTO } from "@/application/dtos/auth/req/ResetPasswordRequestDTO";

export interface IResetPasswordUseCase {
  execute(dto: ResetPasswordRequestDTO): Promise<void>;
}
