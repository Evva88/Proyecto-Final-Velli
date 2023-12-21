import passport from "passport";

export const passportCall = (strategy) => {
  return (req, res, next) => {
    req.logger.info("Inicio de la autenticación");

    passport.authenticate(strategy, (error, user, info) => {
      if (error) {
        req.logger.error("Error de autenticación:", error);
        return res.status(401).send({ error: "Authentication failed" });
      }

      if (!user) {
        req.logger.warn("Autenticación fallida");
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }

      req.user = user;
      req.logger.info("Autenticación exitosa");
      next();
    })(req, res, next);
  };
};

export const authorization = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      req.logger.warn("User is not authenticated");
      return res.status(401).send({ status: "error", message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      req.logger.warn("User does not have the required role");
      return res
        .status(403)
        .send({ status: "error", message: "No permissions" });
    }

    next();
  };
};
