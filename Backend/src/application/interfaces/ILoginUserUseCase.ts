import { LoginRequestDTO } from "@/application/dtos/auth/req/LoginRequestDTO";
import { LoginResponseDTO } from "@/application/dtos/auth/res/LoginResponseDTO";

export interface ILoginUserUseCase {
  execute(dto: LoginRequestDTO): Promise<LoginResponseDTO>;
}
