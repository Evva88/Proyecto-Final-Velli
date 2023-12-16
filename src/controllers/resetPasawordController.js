import nodemailer from "nodemailer";
import crypto from "crypto";
import { userModel } from "../dao/models/user.model.js";
import { GMAIL_PASSWORD, GMAIL_USER } from "../config/configs.js";

const sendResetPasswordEmail = async (userEmail) => {
  const user = await userModel.findOne({ email: userEmail });
  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; 
  await user.save();

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;
  let mailOptions = {
    from: "evavelli5@gmail.com.com",
    to: userEmail,
    subject: "Link de restablecimiento de contraseña",
    text: `Por favor, para restablecer tu contraseña haz clic en el siguiente enlace: ${resetUrl}`,
    html: `<p>Por favor, para restablecer tu contraseña haz clic en el siguiente enlace: <a href="${resetUrl}">restablecer contraseña</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendResetPasswordEmail;
