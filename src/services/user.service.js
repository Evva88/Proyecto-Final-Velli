import UserManager from "../dao/userManager.js";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  PREMIUM_EMAIL,
  PREMIUM_PASSWORD,
} from "../config/configs.js";
import CartManager from "../dao/cartManager.js";
import { GET_INACTIVE_USERS_DAYS } from "../config/configs.js";
import { sendEmailForDeletedUsers } from "../controllers/messages.controller.js";
import EmailService from "./emailservice.js";
import { userModel } from "../dao/models/user.model.js";

const emailService = new EmailService();

class UserService {
  constructor() {
    this.userManager = new UserManager();
    this.cartManager = new CartManager();
  }

  async registerUser({
    first_name,
    last_name,
    email,
    age,
    password,
    role,
    last_connection,
  }) {
    try {
      const cartResponse = await this.cartManager.newCart();
      console.log("Cart response:", cartResponse);
      if (cartResponse.status !== "ok") {
        return { status: "error", message: "Error creating cart" };
      }
      const role =
        email == ADMIN_EMAIL && password === ADMIN_PASSWORD
          ? "admin"
          : email == PREMIUM_EMAIL && password === PREMIUM_PASSWORD
          ? "premium"
          : "user";
      const cartId = cartResponse.id;
      console.log("Cart ID:", cartId);
      const user = await this.userManager.addUser({
        first_name,
        last_name,
        email,
        age,
        password,
        role,
        cart: cartId,
        last_connection,
      });

      if (user) {
        return { status: "success", user, redirect: "/login" };
      } else {
        return { status: "error", message: "User already exists" };
      }
    } catch (error) {
      console.error("Error registering user:", error);
      return { status: "error", message: "Internal Server Error" };
    }
  }

  async restorePassword(user, hashedPassword) {
    return await this.userManager.restorePassword(user, hashedPassword);
  }

  async getAll() {
    const users = await this.userManager.getUsers();
    return users;
  }

  async findOne(email) {
    try {
      const result = await this.userManager.findUser(email);
      if (!email) {
        return result
          .status(401)
          .json({ status: "error", error: "No se pudo encontrar el usuario" });
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteUser(uid) {
    try {
      const userDeleted = await this.userManager.deleteUser(uid);
      console.log("//////services//////");
      console.log("UID");
      console.log(uid);
      console.log("userDeleted");
      console.log(userDeleted);

      return userDeleted;
    } catch (error) {
      log.logger.warn(`Error deleting the user: ${error.message}`);
      next(error);
    }
  }

  async deleteInactiveUsers() {
    try {
      const days = GET_INACTIVE_USERS_DAYS;
      const usersDeleted = await this.userManager.searchLastConnection(days);
      usersDeleted.forEach(async (user) => {
        const title = "Notificacion de eliminacion de cuenta por inactividad";
        const message = `Hola ${user.first_name} \nTe informamos que tu cuenta a sido dada de baja por inactividad. \nPedimos disculpas por los inconvenientes. \nSaludos.`;
        await emailService.sendEmail(
          user.email,
          message,
          title,
          (error, result) => {
            if (error) {
              throw {
                error: result.error,
                message: result.message,
              };
            }
          }
        );
      });
      return usersDeleted;
    } catch (error) {
      log.logger.warn(`Error al eliminar usuarios inactivos: ${error.message}`);
      next(error);
    }
  }

  async updateUser(userId, userToReplace) {
    return await this.userManager.updateUser(userId, userToReplace);
  }

  async getUserById(id) {
    return await this.userManager.getUserById(id);
  }

  async swapUserRole(email) {
    if (!email) {
      return res
        .status(401)
        .json({ status: "error", error: "Email is required." });
    }

    try {
      let user = await this.userManager.findOne(email);
      log.logger.debug(`Get user data from: ${email}`);

      if (!user) {
        return res
          .status(401)
          .json({ status: "error", error: "Can't find user." });
      }

      if (user.role === "admin") {
        return res
          .status(403)
          .json({ status: "error", message: "Admin users cant swap roles" });
      } else {
        const requiredDocuments = [
          "identificationDocument",
          "domicileProofDocument",
          "accountStatementDocument",
        ];

        const hasRequiredDocuments = requiredDocuments.every((document) => {
          return user.documents.some(
            (doc) =>
              doc.reference.includes(document) && doc.status === "Uploaded"
          );
        });

        if (hasRequiredDocuments) {
          if (user.role === "user") {
            user.role = "premium";
            const changedRole = await this.userManager.updateUser(email, user);
            return changedRole;
          } else if (user.role === "premium") {
            user.role = "user";
            const changedRole = await this.userManager.updateUser(email, user);
            return changedRole;
          }
        } else {
          throw new Error(
            "Something went wrong validating. Must have all 3 documents to swap role"
          );
        }
      }
    } catch (error) {
      log.logger.warn(`Error updating user role: ${error.message}`);
      next(error);
    }
  }
}

export default UserService;
