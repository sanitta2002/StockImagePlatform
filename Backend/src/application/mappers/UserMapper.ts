import { User } from "@/domain/entities/User";
import { UserDocument } from "@/infrastructure/models/UserModel";

export class UserMapper {
  static toEntity(document: UserDocument): User {
    return new User(
      document._id.toString(),
      document.firstName,
      document.lastName,
      document.email,
      document.phone,
      document.password
    );
  }

  static toPersistence(user: User) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      password: user.password,
    };
  }
}