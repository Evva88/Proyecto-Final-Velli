import nodemailer from "nodemailer";
import { GMAIL_PASSWORD, GMAIL_USER } from "../config/configs.js";

export default class EmailService {
  static #transporter;
  constructor() {
    if (!EmailService.#transporter) {
      EmailService.#transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      EmailService.#transporter.verify(function (error, success) {
        if (error) {
          console.warn(`Transporter verify error:  ${error} `);
        } else {
          console.info(`Server is ready to take our messages.`);
        }
      });
    }
  }

  #mailOptions = (receiver, title, message) => {
    return {
      from: "Tu Previa" + GMAIL_USER,
      to: receiver,
      subject: title ? title : "Email test",
      html: message ? message : `<div><h1>This is a test</h1></div>`,
      attachments: [],
    };
  };

  async sendEmail(email, message, title, callback) {
    let finalEmail = email ? email : GMAIL_USER;

    EmailService.#transporter.sendMail(
      this.#mailOptions(finalEmail, title, message),
      (error, info) => {
        if (error) {
          function doSomething(callback) {
            callback({
              message: "Error",
              payload: error,
              code: 400,
            });
          }

          function myCallback() {
            console.log("El callback se ejecutó.");
          }

          doSomething(myCallback);
        } else {
          callback(null, { message: "Success!", payload: info });
        }
      }
    );
  }
}
