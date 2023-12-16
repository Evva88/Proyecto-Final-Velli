import UserManager from "../dao/userManager.js";
import { ADMIN_EMAIL, ADMIN_PASSWORD, PREMIUM_EMAIL, PREMIUM_PASSWORD } from "../config/configs.js";
import CartManager from "../dao/cartManager.js";


class UserService {
  constructor() {
    this.userManager = new UserManager();
    this.cartManager = new CartManager();
  }

  async registerUser({ first_name, last_name, email, age, password, role, last_connection }) {
    try {
      const cartResponse = await this.cartManager.newCart();
      console.log("Cart response:", cartResponse);
      if (cartResponse.status !== "ok") {
        return { status: "error", message: "Error creating cart" };
      }
      const role =
        email == ADMIN_EMAIL && password === ADMIN_PASSWORD
        ? "admin"
        :  email == PREMIUM_EMAIL && password === PREMIUM_PASSWORD 
        ? "premium" : "user";
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

 /* async swapUserRole(email, user){
    return await this.userManager.swapUserRole(email, user);
  }

  async updateUser(userId, userToReplace){
    return await this.userManager.updateUser(email, user);
  }

  async findByID(id){
    return await this.userManager.findByID(id);
  }

  async findOne(email){
    return await this.userManager.findOne(email);
  }

  async uploadFiles(userId, files, reference){
    return await this.userManager.uploadFiles(userId, files, reference);
  }

  async changeLastConnection(email, user){
    return await this.userManager.swapUserRole(email, user);
  }

*/

}

export default UserService;
