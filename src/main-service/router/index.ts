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

const apiRouter = express.Router();

new Authentication(apiRouter, {
  userDataSource: new UserDataSource(),
});
new UserRouter(apiRouter, {
  userDataSource: new UserDataSource(),
  voteDataSource: new VoteDataSource(),
});
new TutorRequestRouter(apiRouter, {
  userDataSource: new UserDataSource(),
  tutorRequestDataSource: new TutorRequestDataSource(),
  subjectDataSource: new SubjectDataSource(),
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

new UploadRouter(apiRouter, {});
new VoteRouter(apiRouter, {
  voteDataSource: new VoteDataSource(),
  userDataSource: new UserDataSource(),
});
export default apiRouter;
