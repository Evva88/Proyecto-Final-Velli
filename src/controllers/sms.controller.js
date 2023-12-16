import twilio from "twilio";
import { TWILIO_NUMBER, TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID} from "../config/configs.js";

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const twilioSMSOptions = {
    body: "Esto es un mensaje SMS de prueba usando Twilio desde Coderhouse.",
    from: TWILIO_NUMBER,
    to: "+5491130072687"
}

export const sendSMS = async (req, res) => {
    try {
        req.logger.info("Enviando SMS using Twilio account.");
        req.logger.info(twilioClient);
        const result = await twilioClient.messages.create(twilioSMSOptions);
        res.send({message: "Success!", payload: result});
    } catch (error) {
        req.logger.error("Hubo un problema enviando el SMS usando Twilio.");
        res.status(500).send({error: error});
    }
}