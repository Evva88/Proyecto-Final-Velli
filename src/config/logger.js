import winston from "winston";
import configs from "./configs.js";

//Opciones de logger

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warn: "yellow",
    info: "blue",
    http: "cyan",
    debug: "white",
  },
};

//Custom Logger

export const devLogger = winston.createLogger({
  //Levels
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "warning",
      format: winston.format.simple(),
    }),
  ],
});

//Creando el logger

const prodLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

//Declarar un middleware

class Logger {
  constructor() {
    if (configs.environment === "production") {
      this.logger = prodLogger;
    } else {
      this.logger = devLogger;
    }
  }

  addLogger = (req, res, next) => {
    req.logger = this.logger;
    req.logger.http(
      `${req.method} in ${
        req.url
      } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
    );
    res.on("finish", () => {
      if (res.statusCode >= 400) {
        req.logger.warn(
          `Error ${res.statusCode}: ${res.statusMessage} at ${req.url} `
        );
      }
    });
    next();
  };
}

export const addLogger = (req, res, next) => {
  if (configs.environment === "production") {
    req.logger = prodLogger;
  } else {
    req.logger = devLogger;
  }
  req.logger.info(
    `${req.method} en ${
      req.url
    } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
  );
  next();
};

export default Logger;
