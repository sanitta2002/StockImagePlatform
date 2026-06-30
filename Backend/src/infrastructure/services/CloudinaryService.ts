import { env } from "@/config/envValidation";
import { injectable } from "tsyringe";
import { v2 as cloudinary } from "cloudinary";
import { ICloudinaryService } from "@/domain/interfaces/services/ICloudinaryService";
import { IMAGE_MESSAGE } from "@/domain/constants/Messages";

@injectable()
export class CloudinaryService implements ICloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }
  async uploadImage(filePath: string): Promise<{
    imageUrl: string;
    publicId: string;
  }> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "stock-image-platform",
      });
      console.log("***", result.secure_url,"***",result.public_id);
      return {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error("error uploading image:", error);
      throw new Error(IMAGE_MESSAGE.UPLOAD_IMAGE_ERROR);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("error deleting image:", error);
      throw new Error(IMAGE_MESSAGE.DELETE_IMAGE_ERROR);
    }
  }
}
