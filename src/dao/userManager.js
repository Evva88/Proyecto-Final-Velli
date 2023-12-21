import { userModel } from "./models/user.model.js";
import { createHash, isValidPassword } from "../midsIngreso/bcrypt.js";
import GetUserDTO from "./dtos/getUser.dto.js";
import mongoose from "mongoose";

class UserManager {
  async addUser({
    first_name,
    last_name,
    email,
    age,
    password,
    role,
    cart,
    last_connection,
  }) {
    try {
      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        console.log("User already exists");
        return null;
      }

      const hashedPassword = createHash(password);
      const user = await userModel.create({
        _id: new mongoose.Types.ObjectId(),
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        role,
        cart,
        last_connection: new Date(),
      });

      console.log("User added!", user);
      return user;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }
  async login(user, pass) {
    try {
      const userLogged = await userModel.findOne({ email: user });

      if (userLogged && isValidPassword(userLogged, pass)) {
        const role =
          userLogged.email === "adminCoder@coder.com" ? "admin" : "usuario";

        return userLogged;
      }
      return null;
    } catch (error) {
      console.error("Error durante el login:", error);
      throw error;
    }
  }
  async restorePassword(email, hashedPassword) {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        console.log("Usuario no encontrado.");
        return false;
      }

      user.password = hashedPassword;

      await user.save();

      console.log("Contraseña restaurada correctamente.");
      return true;
    } catch (error) {
      console.error("Error restoring password:", error);
      return false;
    }
  }

  async findUser(user) {
    try {
      const buscadito = await userModel.findOne({ email: user });

      if (buscadito) {
        const role =
          buscadito.email === "adminCoder@coder.com" ? "admin" : "usuario";

        return buscadito;
      }
      return null;
    } catch (error) {
      console.error("Error durante la busqueda:", error);
      throw error;
    }
  }

  async deleteUser(uid) {
    try {
      const user = await userModel.findOne({ email: uid }).lean();
      console.log(email);
      console.log("//////DAO//////");
      console.log("UID");
      console.log(uid);
      console.log("user");
      console.log(user);
      await userModel.deleteOne({ email: uid });
      const userDTO = new GetUserDTO(user);
      return userDTO;
    } catch (error) {
      log.logger.console.warn();
      `Error deleting user: ${error}`;
    }
  }

  async searchLastConnection(days) {
    try {
      const usersLastConnection = await userModel.findOne({
        last_connection: {
          $lt: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      });
      await userModel.deleteMany({
        last_connection: {
          $lt: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      });
      const inactiveUsersDTO = usersLastConnection.map(
        (user) => new GetUserDTO(user)
      );
      return inactiveUsersDTO;
    } catch (error) {
      console.error("Error al encontrar la ultima conexion:", error);
      return false;
    }
  }

  async updateUser(userId, userToReplace) {
    const filter = { email: userId };
    const update = { $set: userToReplace };
    const result = await userModel.updateOne(filter, update);
    return result;
  }

  async getUserById(id) {
    try {
      return await userModel.findById(id).lean();
    } catch (error) {
      console.error("Error fetching product by id:", error);
      return null;
    }
  }

  async findOne(email) {
    const result = await userModel.findOne({ email }).lean();
    return result;
  }

  async getUsers() {
    try {
      const users = await userModel.find().lean();
      return users;
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      throw error;
    }
  }
}

export default UserManager;
