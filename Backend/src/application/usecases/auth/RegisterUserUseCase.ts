import { RegisterUserRequestDTO } from "@/application/dtos/auth/req/RegisterUserRequestDTO";
import { RegisterUserResponseDTO } from "@/application/dtos/auth/res/RegisterUserResponseDTO";
import { IRegisterUserUseCase } from "@/application/interfaces/IRegisterUserUseCase";
import { UserMapper } from "@/application/mappers/UserMapper";
import { ERROR_MESSAGES } from "@/domain/constants/errorMessages";
import { IUserRepository } from "@/domain/interfaces/repositories/IUserRepository";
import { IPasswordHasher } from "@/domain/interfaces/services/IPasswordHasher";
import { inject, injectable } from "tsyringe";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("IPasswordHasher")
    private readonly _passwordService: IPasswordHasher,
  ) {}
  async execute(dto: RegisterUserRequestDTO): Promise<RegisterUserResponseDTO> {
    const existingUser = await this._userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }
    const hashedPassword = await this._passwordService.hash(dto.password);
    const userDoc = await this._userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
    });
    const user = UserMapper.toEntity(userDoc);
    return {
      id: user.id!,
      email: user.email,
      phone: user.phone,
    };
  }
}
