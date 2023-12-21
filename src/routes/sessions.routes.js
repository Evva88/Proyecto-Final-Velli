import express from "express";
import UserManager from "../dao/userManager.js";
import passport from "passport";
import { passportCall, authorization } from "../midsIngreso/passAuth.js";
import UserController from "../controllers/user.controller.js";
import AuthController from "../controllers/auth.controller.js";
import errorHandler from "../services/errors/errorsHandler.js";
import sendResetPasswordEmail from "../controllers/resetPasawordController.js";
import { userModel } from "../dao/models/user.model.js";
import { createHash } from "../midsIngreso/bcrypt.js";
import bodyParser from "body-parser";

const PRIVATE_KEY = "GALL2T1TAD2L1MON";

const serviceRouter = express.Router();
const UM = new UserManager();
const userController = new UserController();
const authController = new AuthController();

serviceRouter.post("/login", (req, res) => authController.login(req, res));

serviceRouter.post("/register", userController.register.bind(userController));

serviceRouter.get(
  "/restore",
  userController.restorePassword.bind(userController)
);

serviceRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

serviceRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.logger.info("GitHub Callback Route");
    authController.githubCallback(req, res);
  }
);
serviceRouter.post("/logout", (req, res) => authController.logout(req, res));

serviceRouter.get(
  "/current",
  passportCall("jwt"),
  authorization("user"),
  (req, res) => {
    req.logger.info(req.cookies);
    userController.currentUser(req, res);
  }
);

serviceRouter.use(bodyParser.urlencoded({ extended: true }));

serviceRouter.post("/restore-password", async (req, res) => {
  authController.restorePassword(req, res);
});

serviceRouter.post("/reset-password/:token", async (req, res) => {
  authController.resetPassword(req, res);
});

serviceRouter.use(errorHandler);

export default serviceRouter;
