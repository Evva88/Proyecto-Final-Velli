
import { Router } from "express";
import {sendEmail, sendEmailWithAttachments} from '../controllers/messages.controller.js';

const emailRouter = Router();

emailRouter.get("/", sendEmail);
emailRouter.get("/attachments", sendEmailWithAttachments);

export default emailRouter;

