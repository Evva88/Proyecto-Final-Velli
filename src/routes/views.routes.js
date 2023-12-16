import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/cartManager.js";
import cartController from "../controllers/cart.controller.js";
import { userModel } from "../dao/models/user.model.js";
import { passportCall } from "../midsIngreso/passAuth.js";


const checkSession = (req, res, next) => {
  req.logger.info('Checking session:', req.session);

  if (req.session && req.session.user) {
    req.logger.info('Session exists:', req.session.user);
    next();
  } else {
    req.logger.warn('No session found, redirecting to /login');
    res.redirect("/login");
  }
};
const checkAlreadyLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    req.logger.info("Usuario ya autenticado, redirigiendo a /profile");
    res.redirect("/profile");
  } else {
    req.logger.error("Usuario no autenticado, procediendo...");
    next();
  }
};

const viewsRouter = express.Router();
const PM = new ProductManager();
const CM = new CartManager();

async function loadUserCart(req, res, next) {
  if (req.session && req.session.user) {
    const cartId = req.session.user.cart;
    req.logger.info('Cart ID:', cartId);  

    const cartManager = new CartManager();
    const cart = await cartManager.getCart(cartId);
    req.logger.info('Cart:', cart); 

    req.cart = cart;
  }
  next();
}

viewsRouter.get("/", checkSession, async (req, res) => {
  const products = await PM.getProducts(req.query);
  res.render("home", { products});
});

viewsRouter.get("/products", checkSession, async (req, res) => {
  const products = await PM.getProducts(req.query);
  const user = req.session.user;
  
  req.logger.info(user);
  res.render("products", { products, user });
});

viewsRouter.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await PM.getProductById(pid);
  if (product) {
    res.render("productDetail", { product });
  } else {
    res.status(404).send({ status: "error", message: "Product not found." });
  }
});

viewsRouter.get("/carts", loadUserCart, async (req, res) => {
  const cart = req.cart;
  if (cart) {
    req.logger.info(JSON.stringify(cart, null, 4));
    res.render("cart", { products: cart.products });
  } else {
    res.status(400).send({
      status: "error",
      message: "Error! No se encuentra el ID de Carrito!",
    });
  }
});

viewsRouter.post("/carts/:cid/purchase", async (req, res) => {
  const cid = req.params.cid;
  cartController.getPurchase(req, res, cid);
});

viewsRouter.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

viewsRouter.get("/chat", (req, res) => {
  res.render("chat");
});

viewsRouter.get("/login", checkAlreadyLoggedIn, (req, res) => {
  res.render("login");
});

viewsRouter.get("/register", checkAlreadyLoggedIn, (req, res) => {
  res.render("register");
});

viewsRouter.get("/profile", checkSession, (req, res) => {
  console.log('Inside /profile route');

  const userData = req.session.user;
  req.logger.info('User data:', userData);

  res.render("profile", { user: userData, userId: userData.id });
});

viewsRouter.get("/restore", async (req, res) => {
  res.render("restore");
});

viewsRouter.get("/upload/:uid", (req, res) => {
  const userId = req.params.uid;
  console.log("ID de usuario: ", userId);
  res.render("uploads", {userId});
});

viewsRouter.get('/premium/:uid', (req, res) => {
  const userId = req.params.uid;
  console.log("ID de usuario: ", userId);
  res.render("premium", {userId});
});


viewsRouter.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const user = await userModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.redirect('/restore');
  }
  res.render('reset-password', { token });
});

viewsRouter.get("/faillogin", (req, res) => {
  res.status(401).json({
    status: "error",
    message: "Login failed. Invalid username or password.",
  });
});

viewsRouter.get("/failregister", async (req, res) => {
  res.send({
    status: "Error",
    message: "Error! No se pudo registar el Usuario!",
  });
});
export default viewsRouter;
