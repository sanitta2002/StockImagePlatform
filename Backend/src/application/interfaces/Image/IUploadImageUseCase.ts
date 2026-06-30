import { UploadImageRequestDTO } from "@/application/dtos/image/req/UploadImageRequestDTO";
import { UploadImageResponseDTO } from "@/application/dtos/image/res/UploadImageResponseDTO";

export interface IUploadImageUseCase {
  execute(dto: UploadImageRequestDTO): Promise<UploadImageResponseDTO>
}