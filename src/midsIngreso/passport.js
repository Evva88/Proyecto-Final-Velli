import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../midsIngreso/bcrypt.js";
import jwt from "passport-jwt";
import CartService from "../services/cart.service.js";
import UserService from "../services/user.service.js";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  PREMIUM_EMAIL,
  PREMIUM_PASSWORD,
} from "../config/configs.js";

const userService = new UserService();
const cartService = new CartService();
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;

//Estrategias de Passport

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
            req.logger.warn(
              "El usuario " + email + " ya se encuentra registrado!"
            );
            return done(null, false);
          }
          user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            rol,
          };
          req.logger.info("Rol antes de la asignación:", user.role);
          if (user.email == ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            req.logger.info("Asignando rol de admin");
            user.role = "admin";
          } else if (
            user.email == PREMIUM_EMAIL &&
            password === PREMIUM_PASSWORD
          ) {
            req.logger.info("Asignando rol de premium");
            user.role = "premium";
          } else {
            req.logger.info("Asignando rol de usuario");
            user.role = "user";
          }
          req.logger.info("Rol después de la asignación:", user.role);
          let result = await userModel.create(user);
          req.logger.info("Usuario después de guardar:", result);
          if (result) {
            return done(null, result);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (username, password, done) => {
        console.log("[Auth] Trying to authenticate user:", username);

        try {
          let user = await userModel.findOne({ email: username });

          if (!user) {
            return done(null, false, { message: "Usuario incorrecto." });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Contraseña incorrecta." });
          }
          if (!user.cart) {
            const cart = await cartService.createCart();

            user.cart = cart._id;
            await userService.updateUser(username, user);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "GALL2T1TAD2L1MON",
      },
      async (jwt_payload, done) => {
        try {
          const user = await userModel.findOne({ email: jwt_payload.email });
          if (!user) {
            return done(null, false, {
              message: "Usuario no encontrado en nuestra base de datos",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await userModel.findById(id);
  done(null, user);
});

export default initializePassport;

const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }

  return token;
};
