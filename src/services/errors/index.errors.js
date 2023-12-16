import EErrors from "./errorsEnum";

export default (error, req, res, next)=>{
    req.logger.debug(`Error cause: ${error.cause}`);
    switch (error.code){
        case EErrors.ROUTING_ERROR:
            res.render("No autorizado");
            break;
        case EErrors.INVALID_TYPE_ERROR:
            res.status(error.status).send({status:"Error", error: error.name || "Un error invalido ha ocurrido", details: error.message, cause: error.cause ? error.cause : "No detallado"});
            break;
        case EErrors.DATABASE_ERROR:
            res.status(error.status).send({status:"Error", error: error.name || "Un error ha ocurrido en la base de datos", details: error.message, cause: error.cause ? error.cause : "No detallado"});
            break;
        case EErrors.PASSWORD_RESTORATION_ERROR:
            res.render("Error para actualizar informacion requerida");
            break;
        case EErrors.AUTHORIZATION_ERROR:
            res.render("No autorizado");
            break;
        case EErrors.MISSING_DATA:
            res.status(error.status).send({status:"Error", error: error.name || "No se envio toda la informacion", details: error.message, cause: error.cause ? error.cause : "No detallado"});
            break;
        case EErrors.RENDERING_ERROR:
            res.render("Error");
            break;
        default:
            req.logger.fatal(error);
            res.status(500).send({status:"error", error: "Error no manejado"});
    };
    
};

