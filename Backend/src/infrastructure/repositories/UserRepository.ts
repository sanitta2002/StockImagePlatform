import { IUserRepository } from "@/domain/interfaces/repositories/IUserRepository";
import { UserDocument, UserModel } from "../models/UserModel";
import { BaseRepository } from "./BaseRepository";
import { User } from "@/domain/entities/User";
import { UserMapper } from "@/application/mappers/UserMapper";

export class UserRepository
  extends BaseRepository<UserDocument>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this._model.findOne({ email });
    if (!userDoc) {
      return null;
    }

    return UserMapper.toEntity(userDoc);
  }
}
