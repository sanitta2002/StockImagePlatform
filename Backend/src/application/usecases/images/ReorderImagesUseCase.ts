import { inject, injectable } from "tsyringe";
import { IImageRepository } from "@/domain/interfaces/repositories/IImageRepository";
import { IReorderImagesUseCase, ReorderItem } from "@/application/interfaces/Image/IReorderImagesUseCase";



@injectable()
export class ReorderImagesUseCase implements IReorderImagesUseCase {
  constructor(
    @inject("IImageRepository")
    private _imageRepository: IImageRepository,
  ) {}

  async execute(userId: string, items: ReorderItem[]): Promise<boolean> {
    for (const item of items) {
      const image = await this._imageRepository.findById(item.id);
      if (image && image.userId.toString() === userId) {
        await this._imageRepository.update(item.id, { order: item.order });
      }
    }
    return true;
  }
}
