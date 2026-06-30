export interface BulkUploadImageItem {
  title: string;
  imageUrl: string;
}

export interface BulkUploadImagesRequestDTO {
  userId: string;
  images: BulkUploadImageItem[];
}
