import { inject, injectable } from "tsyringe";
import { IImageRepository } from "@/domain/interfaces/repositories/IImageRepository";
import { ICloudinaryService } from "@/domain/interfaces/services/ICloudinaryService";
import { IMAGE_MESSAGE } from "@/domain/constants/Messages";
import { IDeleteImageUseCase } from "@/application/interfaces/Image/IDeleteImageUseCase";

@injectable()
export class DeleteImageUseCase implements IDeleteImageUseCase {
  constructor(
    @inject("IImageRepository")
    private _imageRepository: IImageRepository,
  ) {}

  async execute(imageId: string, userId: string): Promise<boolean> {
    const image = await this._imageRepository.findById(imageId);
    if (!image) {
      throw new Error(IMAGE_MESSAGE.IMAGE_NOT_FOUND);
    }
    if (image.userId.toString() !== userId) {
      throw new Error(IMAGE_MESSAGE.UNAUTHORIZED_DELETE);
    }

    const result = await this._imageRepository.delete(imageId);
    return result;
  }
}
