import { inject, injectable } from "tsyringe";
import { IImageRepository } from "@/domain/interfaces/repositories/IImageRepository";
import { ICloudinaryService } from "@/domain/interfaces/services/ICloudinaryService";
import { UploadImageResponseDTO } from "@/application/dtos/image/res/UploadImageResponseDTO";
import { IMAGE_MESSAGE } from "@/domain/constants/Messages";
import { UpdateImageRequestDTO } from "@/application/dtos/image/req/UpdateImageRequestDTO";


@injectable()
export class UpdateImageUseCase {
  constructor(
    @inject("IImageRepository")
    private _imageRepository: IImageRepository,
    @inject("ICloudinaryService")
    private _cloudinaryService: ICloudinaryService,
  ) {}

  async execute(dto: UpdateImageRequestDTO): Promise<UploadImageResponseDTO> {
    const image = await this._imageRepository.findById(dto.imageId);
    if (!image) {
      throw new Error(IMAGE_MESSAGE.IMAGE_NOT_FOUND);
    }
    if (image.userId.toString() !== dto.userId) {
      throw new Error(IMAGE_MESSAGE.UNAUTHORIZED_UPDATE);
    }

    const updates: Partial<{ title: string; imageUrl: string; publicId: string }> = { title: dto.title };

    if (dto.imageUrl) {
  
      const uploadResult = await this._cloudinaryService.uploadImage(dto.imageUrl);
      updates.imageUrl = uploadResult.imageUrl;
      updates.publicId = uploadResult.publicId;
    }

    const updatedImage = await this._imageRepository.update(dto.imageId, updates);
    if (!updatedImage) {
      throw new Error(IMAGE_MESSAGE.UPDATE_FAILED);
    }

    return {
      id: updatedImage._id.toString(),
      title: updatedImage.title,
      imageUrl: updatedImage.imageUrl,
      order: updatedImage.order,
    };
  }
}
