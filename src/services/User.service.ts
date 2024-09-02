import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { promises } from "dns";
import User, { UserDocument, UserInput } from "../models/user.module";
import UserModel from "../models/user.module";
import UserExistError from "../exceptions/UserExistError";
import { NotAuthorizedError } from "../exceptions";

class UserService {
  public async create(UserInput: UserInput): Promise<UserDocument> {
    try {
      const userExist = await this.findByEmail(UserInput.email);

      if (userExist) throw new UserExistError("user already exists");
      UserInput.password = await bcrypt.hash(UserInput.password, 10);

      const user = UserModel.create(UserInput);
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async login(
    UserInput: any
  ): Promise<{ email: string; name: string; token: string }> {
    try {
      const userExist = await this.findByEmail(UserInput.email);

      if (!userExist) throw new NotAuthorizedError("Not authorized");

      const isMatch: boolean = await bcrypt.compare(
        UserInput.password,
        userExist.password
      );

      if (!isMatch) throw new NotAuthorizedError("Not authorized");

      const token = this.generateToken(userExist);

      return { email: userExist.email, name: userExist.name, token };
    } catch (error) {
      throw error;
    }
  }

  public async findAll(): Promise<UserDocument[]> {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: string): Promise<UserDocument | null> {
    try {
      const users = await UserModel.findById(id);
      return users;
    } catch (error) {
      throw error;
    }
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      const user: UserDocument | null = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  private generateToken(user: UserDocument): string {
    try {
      return jwt.sign(
        { user_id: user.id, emamil: user.email, name: user.name },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "5m" }
      );
    } catch (error) {
      throw error;
    }
  }

  public async update(
    id: string,
    userInput: UserInput
  ): Promise<UserDocument | null> {
    try {
      const users = await UserModel.findByIdAndUpdate(id, userInput, {
        returnOriginal: false,
      });
      return users;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
