import mongoose from "mongoose";
import { MONGODB_CNX_STR } from "../config/configs.js";
import { devLogger } from "../config/logger.js";

const URI = MONGODB_CNX_STR

try {
    await mongoose.connect(URI,({
        useNewUrlParser: true,
        useUnifiedTopology: true
      }))
    devLogger.info("Conectado a MongoDB");
} catch (error) {
    devLogger.error(error);
}