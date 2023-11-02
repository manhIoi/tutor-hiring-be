import express from "express";
import Authentication from "./authentication";
import TutorRouter from "./tutorRouter";

const apiRouter = express.Router();

new Authentication(apiRouter);
new TutorRouter(apiRouter);

export default apiRouter;
