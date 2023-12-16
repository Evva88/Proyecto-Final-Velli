import { Router } from "express";
import { getMockProducts } from "./mock.controller.js";

const mockingRouter = Router();

mockingRouter.get("/", getMockProducts);

export default mockingRouter;