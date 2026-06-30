import { UpdateImageRequestDTO } from "@/application/dtos/image/req/UpdateImageRequestDTO";

export interface ReorderItem {
  id: string;
  order: number;
}
export interface IReorderImagesUseCase {
  execute(userId: string, items: ReorderItem[]): Promise<boolean>;
}   