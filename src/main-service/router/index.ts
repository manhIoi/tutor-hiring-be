import express from "express";
import Authentication from "./authentication";
import UserRouter from "./userRouter";

const apiRouter = express.Router();

new Authentication(apiRouter);
new UserRouter(apiRouter);

export default apiRouter;
