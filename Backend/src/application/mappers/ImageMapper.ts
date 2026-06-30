import { Image } from "@/domain/entities/Image";
import { ImageDocument } from "@/infrastructure/models/ImageModel";
import { Types } from "mongoose";

export class ImageMapper {
  static toEntity(document: ImageDocument): Image {
    return new Image(
      document._id.toString(),
      document.userId.toString(),
      document.title,
      document.imageUrl,
      document.publicId,
      document.order,
      document.createdAt,
      document.updatedAt
    );
  }

  static toPersistence(image: Image) {
    return {
      userId: new Types.ObjectId(image.userId),
      title: image.title,
      imageUrl: image.imageUrl,
      publicId: image.publicId,
      order: image.order,
    };
  }
}