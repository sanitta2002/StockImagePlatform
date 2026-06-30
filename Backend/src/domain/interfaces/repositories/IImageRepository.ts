import { IBaseRepository } from "./IBaseRepository";
import { ImageDocument } from "@/infrastructure/models/ImageModel";

export interface IImageRepository
  extends IBaseRepository<ImageDocument> {

  findByUserId(
    userId: string
  ): Promise<ImageDocument[]>;
}