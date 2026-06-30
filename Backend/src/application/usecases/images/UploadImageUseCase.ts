import { UploadImageRequestDTO } from "@/application/dtos/image/req/UploadImageRequestDTO";
import { UploadImageResponseDTO } from "@/application/dtos/image/res/UploadImageResponseDTO";
import { IUploadImageUseCase } from "@/application/interfaces/Image/IUploadImageUseCase";
import { ImageMapper } from "@/application/mappers/ImageMapper";
import { Image } from "@/domain/entities/Image";
import { IImageRepository } from "@/domain/interfaces/repositories/IImageRepository";
import { ICloudinaryService } from "@/domain/interfaces/services/ICloudinaryService";
import { inject, injectable } from "tsyringe";

@injectable()
export class UploadImageUseCase implements IUploadImageUseCase {
  constructor(
    @inject("ICloudinaryService")
    private _cloudinaryService: ICloudinaryService,
    @inject("IImageRepository")
    private _imageRepository: IImageRepository,
  ) {}
  async execute(dto: UploadImageRequestDTO): Promise<UploadImageResponseDTO> {
    const uploadImage = await this._cloudinaryService.uploadImage(dto.imageUrl);
    const image = new Image(
      null,
      dto.userId,
      dto.title,
      uploadImage.imageUrl,
      uploadImage.publicId,
    );
     const savedImage = await this._imageRepository.create(
    ImageMapper.toPersistence(image)
  );

  return {
    id: savedImage._id.toString(),
    title: savedImage.title,
    imageUrl: savedImage.imageUrl,
  };
  }
}
