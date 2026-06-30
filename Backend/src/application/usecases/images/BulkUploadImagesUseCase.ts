import { inject, injectable } from "tsyringe";
import { IBulkUploadImagesUseCase } from "@/application/interfaces/Image/IBulkUploadImagesUseCase";
import { BulkUploadImagesRequestDTO } from "@/application/dtos/image/req/BulkUploadImagesRequestDTO";
import { BulkUploadImagesResponseDTO } from "@/application/dtos/image/res/BulkUploadImagesResponseDTO";
import { ICloudinaryService } from "@/domain/interfaces/services/ICloudinaryService";
import { IImageRepository } from "@/domain/interfaces/repositories/IImageRepository";
import { Image } from "@/domain/entities/Image";
import { ImageMapper } from "@/application/mappers/ImageMapper";
import { UploadImageResponseDTO } from "@/application/dtos/image/res/UploadImageResponseDTO";

@injectable()
export class BulkUploadImagesUseCase implements IBulkUploadImagesUseCase {
  constructor(
    @inject("ICloudinaryService")
    private _cloudinaryService: ICloudinaryService,
    @inject("IImageRepository")
    private _imageRepository: IImageRepository,
  ) {}

  async execute(dto: BulkUploadImagesRequestDTO): Promise<BulkUploadImagesResponseDTO> {
    const uploadedImages: UploadImageResponseDTO[] = [];

    const existingImages = await this._imageRepository.findByUserId(dto.userId);
    let maxOrder = 0;
    if (existingImages.length > 0) {
      maxOrder = Math.max(...existingImages.map(img => img.order || 0));
    }

    for (let i = 0; i < dto.images.length; i++) {
      const item = dto.images[i]!;
      const uploadResult = await this._cloudinaryService.uploadImage(item.imageUrl);
      
      const image = new Image(
        null,
        dto.userId,
        item.title,
        uploadResult.imageUrl,
        uploadResult.publicId,
        maxOrder + i + 1
      );

      const savedImage = await this._imageRepository.create(
        ImageMapper.toPersistence(image)
      );

      uploadedImages.push({
        id: savedImage._id.toString(),
        title: savedImage.title,
        imageUrl: savedImage.imageUrl,
      });
    }

    return { images: uploadedImages };
  }
}
