import { Router } from "express";
import CartManager from "../dao/cartManager.js";
import cartController from "../controllers/cart.controller.js";
import { authorization, passportCall } from "../midsIngreso/passAuth.js";
import { userModel } from "../dao/models/user.model.js";

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.post("/", cartController.createCart.bind(cartController));

cartsRouter.get("/:cid", cartController.getCart.bind(cartController));

cartsRouter.post(
  "/:cid/products/:pid",
  passportCall("jwt"),
  authorization(["user"]),
  cartController.addProductToCart.bind(cartController)
);

cartsRouter.put(
  "/:cid/products/:pid",
  cartController.updateQuantityProductFromCart.bind(cartController)
);

cartsRouter.put("/:cid", cartController.updateCart.bind(cartController));

cartsRouter.delete(
  "/:cid/products/:pid",
  cartController.deleteProductFromCart.bind(cartController)
);

cartsRouter.delete(
  "/:cid",
  cartController.deleteProductsFromCart.bind(cartController)
);

cartsRouter.post(
  "/:cid/purchase",
  (req, res, next) => {
    console.log("Ruta de compra accedida");
    next();
  },
  passportCall("jwt"),
  cartController.createPurchaseTicket.bind(cartController)
);

cartsRouter.get(
  "/usuario/carrito",
  passportCall("jwt"),
  authorization(["user"]),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await userModel.findById(userId);

      if (!user || !user.cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      return res.json({ id: user.cart });
    } catch (error) {
      req.logger.error("Error obteniendo el carrito del usuario:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

export default cartsRouter;
