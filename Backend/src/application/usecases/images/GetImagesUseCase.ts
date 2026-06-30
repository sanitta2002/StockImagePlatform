import { inject, injectable } from "tsyringe";
import { IImageRepository } from "@/domain/interfaces/repositories/IImageRepository";
import { UploadImageResponseDTO } from "@/application/dtos/image/res/UploadImageResponseDTO";
import { IGetImagesUseCase } from "@/application/interfaces/Image/IGetImagesUseCase";

@injectable()
export class GetImagesUseCase implements IGetImagesUseCase {
  constructor(
    @inject("IImageRepository")
    private _imageRepository: IImageRepository,
  ) {}

  async execute(userId: string): Promise<UploadImageResponseDTO[]> {
    const images = await this._imageRepository.findByUserId(userId);
    return images.map(img => ({
      id: img._id.toString(),
      title: img.title,
      imageUrl: img.imageUrl,
      order: img.order,
    }));
  }
}
