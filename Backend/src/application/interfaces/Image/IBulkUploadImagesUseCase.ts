import { BulkUploadImagesRequestDTO } from "../../dtos/image/req/BulkUploadImagesRequestDTO";
import { BulkUploadImagesResponseDTO } from "../../dtos/image/res/BulkUploadImagesResponseDTO";

export interface IBulkUploadImagesUseCase {
  execute(dto: BulkUploadImagesRequestDTO): Promise<BulkUploadImagesResponseDTO>;
}
