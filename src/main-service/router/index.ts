import express from "express";
import Authentication from "./authentication";
import UserRouter from "./userRouter";
import TutorRequestRouter from "./tutor-request.router";
import SubjectRouter from "./subjectRouter";
import UserDataSource from "../datasource/userDataSource";
import TutorRequestDataSource from "../datasource/tutorRequestDataSource";
import ChatRouter from "./ChatRouter";
import ChatDataSource from "../datasource/chatDataSource";
import SubjectDataSource from "../datasource/subjectDataSource";
import RoomChatRouter from "./room-chat.router";
import RoomChatDataSource from "../datasource/roomChatDataSource";

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
new SubjectRouter(apiRouter, {
  subjectDataSource: new SubjectDataSource(),
});
new ChatRouter(apiRouter, {
  chatDataSource: new ChatDataSource(),
});

new RoomChatRouter(apiRouter, {
  roomChatDataSource: new RoomChatDataSource(),
});

export default apiRouter;
