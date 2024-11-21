import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User, { UserDocument, UserInput } from "../models/User";
import UserExistError from "../exceptions/UserExistError";
import NotAuthorizedError from "../exceptions/NotAuthorizedError";

class UserService {
  public async create(UserInput: UserInput): Promise<UserDocument> {
    try {
      console.log('=== DEBUG CREATE ===');
      console.log('1. Datos recibidos:', {
        email: UserInput.email,
        passwordLength: UserInput.password?.length
      });
      
      const userExist = await this.findByEmail(UserInput.email);
      console.log('2. ¿Usuario existe?:', !!userExist);

      if (userExist) {
        throw new UserExistError("user already exists");
      }

      const user = await User.create(UserInput);
      console.log('3. Usuario creado:', {
        email: user.email,
        hasPassword: !!user.password,
        passwordLength: user.password?.length
      });
      
      return user;
    } catch (error) {
      console.error('4. Error en create:', error);
      throw error;
    }
  }

  public async login(
    UserInput: { email: string; password: string }
  ): Promise<{ email: string; name: string; token: string }> {
    try {
      console.log('=== DEBUG LOGIN ===');
      console.log('1. Email recibido:', UserInput.email);
      
      const userExist = await this.findByEmail(UserInput.email);
      console.log('2. Usuario encontrado:', !!userExist);
      console.log('3. Datos del usuario:', {
        email: userExist?.email,
        hasPassword: !!userExist?.password,
        passwordLength: userExist?.password?.length
      });

      if (!userExist) {
        console.log('4. Error: Usuario no encontrado');
        throw new NotAuthorizedError("Usuario no encontrado");
      }

      console.log('5. Contraseña recibida:', UserInput.password);
      console.log('6. Contraseña almacenada (hash):', userExist.password);
      
      const isMatch = await bcrypt.compare(
        UserInput.password,
        userExist.password
      );
      console.log('7. ¿Contraseñas coinciden?:', isMatch);

      if (!isMatch) {
        console.log('8. Error: Contraseña incorrecta');
        throw new NotAuthorizedError("Contraseña incorrecta");
      }

      const token = jwt.sign(
        { 
          user_id: userExist._id, 
          email: userExist.email,
          role: userExist.role 
        },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
      );
      console.log('9. Token generado exitosamente');

      return { email: userExist.email, name: userExist.name, token };
    } catch (error) {
      console.error('10. Error en login:', error);
      throw error;
    }
  }

  public async findAll(): Promise<UserDocument[]> {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: string): Promise<UserDocument | null> {
    try {
      const users = await User.findById(id);
      return users;
    } catch (error) {
      throw error;
    }
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      console.log('Buscando usuario por email:', email);
      const user = await User.findOne({ email });
      console.log('Usuario encontrado:', !!user);
      return user;
    } catch (error) {
      console.error('Error en findByEmail:', error);
      throw error;
    }
  }

  private generateToken(user: UserDocument): string {
    try {
      return jwt.sign(
        { 
          user_id: user.id, 
          email: user.email, 
          name: user.name,
          role: user.role 
        },
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
      const users = await User.findByIdAndUpdate(id, userInput, {
        returnOriginal: false,
      });
      return users;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      console.log('=== DEBUG DELETE SERVICE ===');
      console.log('1. Intentando eliminar usuario:', id);
      
      // Verificar si el usuario existe antes de eliminarlo
      const userExists = await User.findById(id);
      if (!userExists) {
        console.log('2. Usuario no encontrado');
        return false;
      }

      const result = await User.findByIdAndDelete(id);
      console.log('3. Resultado de la eliminación:', !!result);
      
      return result !== null;
    } catch (error) {
      console.error('4. Error al eliminar usuario:', error);
      throw error;
    }
  }
}

export default new UserService();
