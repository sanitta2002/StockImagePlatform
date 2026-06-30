import { RegisterUserRequestDTO } from "../dtos/auth/req/RegisterUserRequestDTO";
import { RegisterUserResponseDTO } from "../dtos/auth/res/RegisterUserResponseDTO";

export interface IRegisterUserUseCase {
  execute(
    dto: RegisterUserRequestDTO
  ): Promise<RegisterUserResponseDTO>;
}