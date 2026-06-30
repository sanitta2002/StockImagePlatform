import { container } from "tsyringe";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { BcryptPasswordHasher } from "@/infrastructure/services/PasswordHasher";
import { JwtService } from "@/infrastructure/services/JwtService";
import { RegisterUserUseCase } from "@/application/usecases/auth/RegisterUserUseCase";
import { LoginUserUseCase } from "@/application/usecases/auth/LoginUserUseCase";
import { RefreshTokenUseCase } from "@/application/usecases/auth/RefreshTokenUseCase";
import { ForgotPasswordUseCase } from "@/application/usecases/auth/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "@/application/usecases/auth/ResetPasswordUseCase";
import { MailService } from "../services/MailService";
import { CloudinaryService } from "../services/CloudinaryService";
import { ImageRepository } from "../repositories/ImageRepository";
import { UploadImageUseCase } from "@/application/usecases/images/UploadImageUseCase";

import { BulkUploadImagesUseCase } from "@/application/usecases/images/BulkUploadImagesUseCase";
import { GetImagesUseCase } from "@/application/usecases/images/GetImagesUseCase";
import { UpdateImageUseCase } from "@/application/usecases/images/UpdateImageUseCase";
import { DeleteImageUseCase } from "@/application/usecases/images/DeleteImageUseCase";
import { ReorderImagesUseCase } from "@/application/usecases/images/ReorderImagesUseCase";

container.register("IUserRepository", {
  useClass: UserRepository,
});


container.register("IPasswordHasher", {
  useClass: BcryptPasswordHasher,
});

container.register("IJwtService", {
  useClass: JwtService,
});

container.register("IRegisterUserUseCase", {
  useClass: RegisterUserUseCase,
});

container.register("ILoginUserUseCase", {
  useClass: LoginUserUseCase,
});

container.register("IRefreshTokenUseCase", {
  useClass: RefreshTokenUseCase,
});
container.register("IForgotPasswordUseCase", {
  useClass: ForgotPasswordUseCase,
});
container.register("IResetPasswordUseCase", {
  useClass: ResetPasswordUseCase,
});
container.register("IMailService", {
  useClass: MailService,
});
container.register("IImageRepository", {
  useClass: ImageRepository,
});
container.register("ICloudinaryService", {
  useClass: CloudinaryService,
});
container.register("IUploadImageUseCase", {
  useClass: UploadImageUseCase,
});

container.register("IBulkUploadImagesUseCase", {
  useClass: BulkUploadImagesUseCase,
});
container.register("IGetImagesUseCase", {
  useClass: GetImagesUseCase,
});
container.register("IUpdateImageUseCase", {
  useClass: UpdateImageUseCase,
});
container.register("IDeleteImageUseCase", {
  useClass: DeleteImageUseCase,
});
container.register("IReorderImagesUseCase", {
  useClass: ReorderImagesUseCase,
});

export { container };
