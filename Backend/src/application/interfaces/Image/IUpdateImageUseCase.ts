import { UpdateImageRequestDTO } from "@/application/dtos/image/req/UpdateImageRequestDTO";

export interface IUpdateImageUseCase {
  execute(request: UpdateImageRequestDTO): Promise<void>;
}