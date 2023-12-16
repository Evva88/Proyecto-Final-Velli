import nodemailer from "nodemailer";
import { GMAIL_PASSWORD, GMAIL_USER } from "../config/configs.js";
import __dirname from "../../utils.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const mailOptions = {
  from: "Coder Test " + GMAIL_USER,
  to: GMAIL_USER,
  subject: "Correo de prueba Coderhouse Programacion Backend.",
  html: "<div><h1>Esto es un Test de envio de correos con Nodemailer!</h1></div>",
  attachments: [],
};

const mailOptionsWithAttachments = {
  from: "Coder Test " + GMAIL_USER,
  to: GMAIL_USER,
  subject: "Correo de prueba Coderhouse Programacion Backend.",
  html: `<div>
              <h1>Esto es un Test de envio de correos con Nodemailer!</h1>
              <p>Ahora usando imagenes: </p>
              <img src="cid:"/>
          </div>`,
  attachments: [
    {
      filename: "Tu Previa",
      path: __dirname+'/src/public/images/',
      cid: "Logo",
    },
  ],
};

export const sendEmail = (req, res) => {
  try {
    let result = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ message: "Error", payload: error });
      }
      req.logger.info("Message sent: %s", info.messageId);
      res.send({ message: "Success!", payload: info });
    });
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .send({
        error: error,
        message: "No se pudo enviar el email desde:" + config.gmailAccount,
      });
  }
};

export const sendEmailWithAttachments = (req, res) => {
  try {
    let result = transporter.sendMail(
      mailOptionsWithAttachments,
      (error, info) => {
        if (error) {
          req.logger.error(error);
          res.status(400).send({ message: "Error", payload: error });
        }
        req.logger.info("Message sent: %s", info.messageId);
        res.send({ message: "Success!", payload: info });
      }
    );
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .send({
        error: error,
        message: "No se pudo enviar el email desde:" + config.gmailAccount,
      });
  }
};

