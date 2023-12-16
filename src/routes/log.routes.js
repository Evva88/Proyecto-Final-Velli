import { Router } from "express";

const logRouter = new Router();

logRouter.get("/", (req, res) =>{
    req.logger.fatal("Error catastrofico, algo salio muy mal");
    req.logger.error("Error de alto nivel");
    req.logger.warn("Mensaje de advertencia");
    req.logger.info(`Este es un log de informacion.`);
    req.logger.http("Http log");
    req.logger.debug("Este es un log de informacion de developer");
    res.send({message:"Test de logger"})

});

export default logRouter;