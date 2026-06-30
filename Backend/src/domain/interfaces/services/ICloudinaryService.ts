export interface ICloudinaryService {
uploadImage(filePath: string): Promise<{
  imageUrl: string;
  publicId: string;
}>;

  deleteImage(publicId: string): Promise<void>;
}