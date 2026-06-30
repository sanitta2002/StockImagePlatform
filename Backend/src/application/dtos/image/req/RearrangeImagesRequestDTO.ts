export interface RearrangeImagesRequestDTO {
  images: {
    id: string;
    order: number;
  }[];
}