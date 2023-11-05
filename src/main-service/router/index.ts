import express from "express";
import Authentication from "./authentication";
import UserRouter from "./userRouter";
import TutorRequestRouter from "./tutor-request.router";
import SubjectRouter from "./subjectRouter";
import UserDataSource from "../datasource/userDataSource";
import TutorRequestDataSource from "../datasource/tutorRequestDataSource";

const apiRouter = express.Router();

new Authentication(apiRouter, {
  userDataSource: new UserDataSource(),
});
new UserRouter(apiRouter, {
  userDataSource: new UserDataSource(),
});
new TutorRequestRouter(apiRouter, {
  userDataSource: new UserDataSource(),
  tutorRequestDataSource: new TutorRequestDataSource(),
});
new SubjectRouter(apiRouter);

export default apiRouter;
