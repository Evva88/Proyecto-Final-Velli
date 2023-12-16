import ProductsServices from "../services/products.service.js";
import { socketServer } from "../../app.js";
import mongoose from "mongoose";
import CustomeError from "../services/errors/customeError.js";
import { productError } from "../services/errors/errorMessages/product.error.js";

class ProductController {
  constructor() {
    this.productService = new ProductsServices();
  }

  async getProducts(req, res) {
    try {
      const products = await this.productService.getProducts(req.query);
      res.send(products);
    } catch (error) {
      const productErr = new CustomeError({
        name: "Product Fetch Error",
        message: "Error al obtener los productos",
        code:500,
        cause:error.message,
      });
      req.logger.error(productErr);
      res.status(productErr.code).send({status:"error", message:"Error al obtener los productos"})
    }
  }

  async getProductById(req, res, next) {
    try {
      const pid = req.params.pid;
      req.logger.info("Product ID:", pid);
      if(!mongoose.Types.ObjectId.isValid(pid)){
        throw new CustomeError({
          name: "Invalid ID",
          message: "El ID no es correcto",
          code:400,
          cause: productError(pid),
        });
      }
      const product = await this.productService.getProductById(pid);
      if (!product) {
        throw new CustomeError({
          name: "Product not found",
          message: "El producto no pudo ser encontrado",
          code:404,
        });
      }
        res.status(200).json({ status: "success", data: product });
        return;
      
    } catch (error) {
      next(error)
    }
  }

  async addProduct(req, res) {
    let {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    req.logger.info("Received thumbnail:", thumbnail);
    const owner = req.user_id;
    if (!title) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Title!",
      });
      return false;
    }

    if (!description) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Description!",
      });
      return false;
    }

    if (!code) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Code!",
      });
      return false;
    }

    if (!price) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Price!",
      });
      return false;
    }

    status = !status && true;

    if (!stock) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Stock!",
      });
      return false;
    }

    if (!category) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Category!",
      });
      return false;
    }

    if (!thumbnail) {
      res.status(400).send({
        status: "error",
        message: "Error! No se cargó el campo Thumbnail!",
      });
      return false;
    }
    try {
      const wasAdded = await this.productService.addProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
        owner,
      });

      if (wasAdded && wasAdded._id) {
        req.logger.info("Producto añadido correctamente:", wasAdded);
        res.send({
          status: "ok",
          message: "El Producto se agregó correctamente!",
          productId: wasAdded._id,
        });
        socketServer.emit("product_created", {
          _id: wasAdded._id,
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail,
          owner,
        });
        return;
      } else {
        req.logger.error("Error al añadir producto, wasAdded:", wasAdded);
        res.status(500).send({
          status: "error",
          message: "Error! No se pudo agregar el Producto!",
        });
        return;
      }
    } catch (error) {
      req.logger.error("Error en addProduct:", error, "Stack:", error.stack);
      res
        .status(500)
        .send({ status: "error", message: "Internal server error." });
      return;
    }
  }

  async updateProduct(req, res) {
    try {
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      } = req.body;
      const pid = req.params.pid;

      const wasUpdated = await this.productService.updateProduct(pid, {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      });

      if (wasUpdated) {
        res.send({
          status: "ok",
          message: "El Producto se actualizó correctamente!",
        });
        socketServer.emit("product_updated");
      } else {
        res.status(500).send({
          status: "error",
          message: "Error! No se pudo actualizar el Producto!",
        });
      }
    } catch (error) {
      req.logger.error(error);
      res
        .status(500)
        .send({ status: "error", message: "Internal server error." });
    }
  }

  async deleteProduct(req, res) {
    try {
      const pid = req.params.pid;

      if (!mongoose.Types.ObjectId.isValid(pid)) {
        req.logger.error("ID del producto no válido");
        res.status(400).send({
          status: "error",
          message: "ID del producto no válido",
        });
        return;
      }

      const product = await this.productService.getProductById(pid);

      console.log("user", req.user);
      console.log("product owner", product.owner);

      if (!product) {
        console.log("Producto no encontrado");
        res.status(404).send({
          status: "error",
          message: "Producto no encontrado",
        });
        return;
      }

      if (
        !req.user ||
        (req.user.role !== "admin" &&
          (!product.owner ||
            req.user._id.toString() !== product.owner.toString()))
      ) {
        req.logger.error(
          "Operación no permitida: el usuario no tiene derechos para eliminar este producto o el producto no tiene propietario definido."
        );
        res.status(403).send({
          status: "error",
          message:
            "No tiene permiso para eliminar este producto o producto no tiene propietario.",
        });
        return;
      }

      const wasDeleted = await this.productService.deleteProduct(pid);

      if (wasDeleted) {
        console.log("Producto eliminado exitosamente");
        res.send({
          status: "ok",
          message: "Producto eliminado exitosamente",
        });
        socketServer.emit("product_deleted", { _id: pid });
      } else {
        console.log("Error eliminando el producto");
        res.status(500).send({
          status: "error",
          message: "Error eliminando el producto",
        });
      }
    } catch (error) {
      req.logger.error("Error en deleteProduct:", error);
      res
        .status(500)
        .send({ status: "error", message: "Error interno del servidor" });
    }
  }
}
export default new ProductController();