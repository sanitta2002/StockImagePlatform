import { IBaseRepository } from "./IBaseRepository";
import { UserDocument } from "@/infrastructure/models/UserModel";
import { User } from "@/domain/entities/User";

export interface IUserRepository
  extends IBaseRepository<UserDocument> {

  findByEmail(
    email: string
  ): Promise<User | null>;
}