import { IImageRepository } from "@/domain/interfaces/repositories/IImageRepository";
import { ImageDocument, ImageModel } from "../models/ImageModel";
import { BaseRepository } from "./BaseRepository";
import { Types } from "mongoose";


export class ImageRepository
  extends BaseRepository<ImageDocument>
  implements IImageRepository
{
  constructor() {
    super(ImageModel);
  }

  async findByUserId(userId: string): Promise<ImageDocument[]> {
    return await this._model.find({ userId: new Types.ObjectId(userId) }).sort({ order: 1 });
  }
}
