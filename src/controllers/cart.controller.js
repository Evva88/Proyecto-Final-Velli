import ProductManager from "../dao/ProductManager.js";
import { cartModel } from "../dao/models/cart.model.js";
import CartServices from "../services/cart.service.js";
import ticketController from "./ticket.controller.js";
import { v4 as uuidv4 } from "uuid";

class CartController {
  constructor() {
    this.cartService = new CartServices();
  }

  async createCart(req, res) {
    try {
      const newCart = await this.cartService.createCart();
      res.status(201).json({
        status: "success",
        message: "El carrito creado correctamente",
        cartId: newCart._id,
        payload: newCart,
      });
      req.logger.info("Carrito creado: ", newCart);
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message,
      });
      req.logger.error("Error al crear el carrito: ", error);
    }
  }

  async getCart(req, res) {
    try {
      const cart = await this.cartService.getCart(req.params.cid);
      res.json({
        status: "success",
        cart: cart,
      });
      req.logger.info("Carrito obtenido: ", cart);
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
      req.logger.error("Error al obtener el carrito: ", error);
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.addProductToCart(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateQuantityProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const result = await this.cartService.updateQuantityProductFromCart(
        cid,
        pid,
        quantity
      );
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const cid = req.params.cid;
      const products = req.body.products;
      await this.cartService.updateCart(cid, products);
      res.send({
        status: "ok",
        message: "El producto se agregó correctamente!",
      });
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async deleteProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.deleteProductFromCart(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async deleteProductsFromCart(req, res) {
    try {
      const cid = req.params.cid;
      const result = await this.cartService.deleteProductsFromCart(cid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async createPurchaseTicket(req, res) {
    req.logger.info("Ruta /carts/:cid/purchase accedida");

    try {
      if (!req.user || !req.user.id) {
        req.logger.error("req.user no está definido");
        return res.status(400).json({ error: "Usuario no definido" });
      }

      const cart = await this.cartService.getCart(req.params.cid);

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      req.logger.info("Productos en el carrito:", cart.products);

      const productManager = new ProductManager();
      const failedProducts = [];
      const successfulProducts = [];

      for (const item of cart.products) {
        const product = await productManager.getProductById(item.product);

        if (!product) {
          req.logger.error(`Producto ${item.product} no encontrado`);
          failedProducts.push(item);
          continue;
        }

        if (product.stock < item.quantity) {
          req.logger.error(
            `Stock insuficiente para el producto ${JSON.stringify(
              item.product
            )}`
          );
          failedProducts.push(item);
        } else {
          successfulProducts.push(item);
          const newStock = product.stock - item.quantity;
          await productManager.updateProduct(item.product, { stock: newStock });
        }
      }

      await cartModel.updateOne(
        { _id: req.params.cid },
        { products: failedProducts }
      );

      if (successfulProducts.length === 0) {
        return res.status(400).json({
          error: "No se pudo comprar ningun producto",
          failedProducts,
        });
      }

      const totalAmount = successfulProducts.reduce((total, product) => {
        return total + product.product.price * product.quantity;
      }, 0);

      const ticketData = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: req.user.email,
      };

      const ticketCreated = await ticketController.createTicket({
        body: ticketData,
      });
      res.json({
        status: "success",
        message: "Compra realizada con éxito",
        ticket: ticketCreated,
        failedProducts: failedProducts.length > 0 ? failedProducts : undefined,
      });
    } catch (error) {
      req.logger.error("Error específico al crear el ticket de compra:", error);
      res.status(500).json({ error: "Error al crear el ticket de compra" });
    }
  }

  async getPurchase(req, res) {
    try {
      const cid = req.params.cid;
      const purchase = await this.cartService.getCart(cid);

      if (purchase) {
        res.json({ status: "success", data: purchase });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "Compra no encontrada" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "error", message: "Error interno del servidor" });
    }
  }
}

export default new CartController();
