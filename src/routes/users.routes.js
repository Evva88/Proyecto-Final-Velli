import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import uploadConfig from "../multer/multer.js";

const userRouter = Router();
const userController = new UserController();

userRouter.post('/premium/:uid', userController.upgradeToPremium);
userRouter.post('/:uid/documents', uploadConfig.fields([
    {name:"profiles", maxCount:1},
    {name:"products", maxCount:1},
    {name:"document", maxCount:1},
]), userController.uploadFiles);
userRouter.post('/:uid/premium-documents', uploadConfig.fields([
    {name:"identificationDocument", maxCount:1},
    {name:"domicileProofDocument", maxCount:1},
    {name:"accountStatementDocument", maxCount:1},
]), userController.uploadPremiumDocuments);


export default userRouter;