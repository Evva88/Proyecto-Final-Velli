import CartManager from "../dao/cartManager.js";

class CartService {
  constructor() {
    this.cartManager = new CartManager();
  }

  async createCart() {
    return await this.cartManager.newCart();
  }

  async getCart(id) {
    return await this.cartManager.getCart(id);
  }

  async addProductToCart(cid, pid) {
    const result = await this.cartManager.addProductToCart(cid, pid);
    if (result) {
      return { status: "ok", message: "El producto se agregó correctamente!" };
    } else {
      throw new Error("Error! No se pudo agregar el Producto al Carrito!");
    }
  }

  async updateQuantityProductFromCart(cartId, productId, quantity) {
    const result = await this.cartManager.updateQuantityProductFromCart(
      cartId,
      productId,
      quantity
    );
    if (result) {
      return {
        status: "ok",
        message: "El producto se actualizó correctamente",
      };
    } else {
      throw new Error("Error: No se pudo actualizar el producto del carrito");
    }
  }

  async deleteProductFromCart(cartId, productId) {
    const result = await this.cartManager.deleteProductFromCart(
      cartId,
      productId
    );
    if (result) {
      return { status: "ok", message: "El producto se eliminó correctamente" };
    } else {
      throw new Error("Error: No se pudo eliminar el producto del carrito");
    }
  }

  async deleteCart(cartId) {
    const result = await this.cartManager.deleteProductFromCart(cid, pid);
    if (result) {
      res.send({
        status: "ok",
        message: "El producto se eliminó correctamente",
      });
    } else {
      res.status(400).send({
        status: "error",
        message: "Error: No se pudo eliminar el producto del carrito",
      });
    }
    return await this.cartManager.deleteProductFromCart(cid, pid);
  }

  async updateCart(cartId, products) {
    const result = await this.cartManager.updateProducts(cartId, products);
    if (result) {
      return { status: "ok", message: "El carrito se actualizó correctamente" };
    } else {
      throw new Error("Error: No se pudo actualizar el carrito");
    }
  }

  async deleteProductsFromCart(cartId) {
    const result = await this.cartManager.deleteProductsFromCart(cartId);
    if (result) {
      return { status: "ok", message: "El carrito se vació correctamente!" };
    } else {
      throw new Error('Error! No se pudo vaciar el Carrito!');
    }
  }
}

export default CartService;
