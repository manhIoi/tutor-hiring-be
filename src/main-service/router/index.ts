import express from "express";
import Authentication from "./authentication";

const apiRouter = express.Router();

new Authentication(apiRouter);

export default apiRouter;
