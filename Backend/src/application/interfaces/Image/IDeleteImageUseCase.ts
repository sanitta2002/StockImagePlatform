import { UpdateImageRequestDTO } from "@/application/dtos/image/req/UpdateImageRequestDTO";

export interface IDeleteImageUseCase {
  execute(imageId: string, userId: string): Promise<boolean>;
}