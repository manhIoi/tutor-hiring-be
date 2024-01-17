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
import UploadRouter from "./upload.router";
import VoteRouter from "./voteRouter";
import VoteDataSource from "../datasource/voteDataSource";
import NotificationRouter from "./notification.router";
import NotificationDataSource from "../datasource/notificationDataSource";
import { chatSocket } from "../socket";

const apiRouter = express.Router();

new Authentication(apiRouter, {
  userDataSource: new UserDataSource(),
});
new UserRouter(
  apiRouter,
  {
    userDataSource: new UserDataSource(),
    voteDataSource: new VoteDataSource(),
  },
  {
    socketService: chatSocket,
  },
);
new TutorRequestRouter(
  apiRouter,
  {
    userDataSource: new UserDataSource(),
    tutorRequestDataSource: new TutorRequestDataSource(),
    subjectDataSource: new SubjectDataSource(),
  },
  {
    socketService: chatSocket,
  },
);
new SubjectRouter(apiRouter, {
  subjectDataSource: new SubjectDataSource(),
});
new ChatRouter(apiRouter, {
  chatDataSource: new ChatDataSource(),
  tutorRequestDataSource: new TutorRequestDataSource(),
});

new RoomChatRouter(apiRouter, {
  roomChatDataSource: new RoomChatDataSource(),
  tutorRequestDataSource: new TutorRequestDataSource(),
});

new UploadRouter(apiRouter, {});
new VoteRouter(apiRouter, {
  voteDataSource: new VoteDataSource(),
  userDataSource: new UserDataSource(),
  tutorRequestDataSource: new TutorRequestDataSource(),
});

new NotificationRouter(apiRouter, {
  notificationDataSource: new NotificationDataSource(),
});
export default apiRouter;
