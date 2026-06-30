import { UploadImageResponseDTO } from "@/application/dtos/image/res/UploadImageResponseDTO";

export interface IGetImagesUseCase {
  execute(userId: string): Promise<UploadImageResponseDTO[]>;
}