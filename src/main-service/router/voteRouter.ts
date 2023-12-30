import { IRouter } from "express";
import VoteDataSource from "../datasource/voteDataSource";
import { verifyJWT } from "../common/middleware";
import ErrorCode from "../constant/errorCode";
import UserDataSource from "../datasource/userDataSource";
import { removeHiddenField } from "../utils/authentication.util";
import { chatSocket } from "../socket";
import { Role } from "../../common/model/User";
import TutorRequestDataSource from "../datasource/tutorRequestDataSource";
import { EStatusRequest } from "../model/tutor-request.model";
import { faker } from "@faker-js/faker";

type IDataSource = {
  voteDataSource: VoteDataSource;
  userDataSource: UserDataSource;
  tutorRequestDataSource: TutorRequestDataSource;
};

class VoteRouter {
  router: IRouter;
  dataSource: IDataSource;
  constructor(router: IRouter, dataSource: IDataSource) {
    this.router = router;
    this.dataSource = dataSource;
    this.registerRoutes();
  }

  registerRoutes() {
    /** registry routes */
    this.insertVote();
    this.updateVote();
    this.getVoteByUser();
    this.getVoteByClassDone();
    this.getOtherVoteByClassDone();
    this.randomVoteData();
  }

  private _insertWithSocket = async (voteData) => {
    try {
      const [newVote] = await this.dataSource.voteDataSource.insertVote(voteData);
      const newUser = await this.dataSource.userDataSource.updateUser(
        { _id: voteData?.userReceive },
        {
          $push: { votes: newVote?._id },
        },
      );
      console.info(`LOG_IT:: insert vote`, newUser);
      chatSocket.emitEvent(
        `vote_teacher_${newUser?._id}`,
        {
          title: "Đánh giá mới",
          message: `Bạn nhận được đánh giá mới từ lớp học ${newVote?.class}`,
          user: newUser?._id,
          data: JSON.stringify({
            type: "tutor_request",
            id: newVote?.class,
          }),
        },
        true,
      );
      return {
        newVote, newUser
      }
    } catch (error) {

    }
  }

  insertVote() {
    this.router.post("/vote/add", verifyJWT, async (req, res) => {
      try {
        const body = req.body;
        console.info(`LOG_IT:: insert vote`, body);
        const data = this._insertWithSocket(body);
        return res.send(data);
      } catch (e) {
        console.info(`LOG_IT:: insertVote e`, e);
        return res
          .status(ErrorCode.BAD_REQUEST)
          .json({ error: "Vote failure!" });
      }
    });
  }
  updateVote() {
    this.router.post("/vote/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {
        _id: id,
      };
      const newData = req.body;
      return this.dataSource.voteDataSource.updateVote(filter, newData);
    });
  }

  getVoteByUser() {
    this.router.get("/vote/teacher/:id", verifyJWT, async (req, res) => {
      try {
        const response = await this.dataSource.voteDataSource.findVoteByTeacher(
          req.params.id,
        );

        return res.send(response);
      } catch (e) {
        return res
          .status(ErrorCode.BAD_REQUEST)
          .json({ error: "Get vote failure!" });
      }
    });
  }

  getVoteByClassDone() {
    this.router.get("/vote/class/:id/:idUser", verifyJWT, async (req, res) => {
      try {
        const { id, idUser } = req.params;
        const response =
          await this.dataSource.voteDataSource.findVoteByClassDone(id, idUser);
        return res.send(response);
      } catch (e) {

        console.log(`🔥LOG_IT:: getVoteByClassDone e`, e)
        return res
          .status(ErrorCode.BAD_REQUEST)
          .json({ error: "Get vote failure!" });
      }
    });
  }

  getOtherVoteByClassDone() {
    this.router.get("/vote/class/other-vote/:id/:idUser", verifyJWT, async (req, res) => {
      try {
        const { id, idUser } = req.params;
        const response =
          await this.dataSource.voteDataSource.findVoteByQuery({
            class: id,
            userSend: {
              $ne: idUser
            }
          });
        return res.send(response);
      } catch (e) {
        return res
          .status(ErrorCode.BAD_REQUEST)
          .json({ error: "Get other vote failure!" });
      }
    });
  }

  randomVoteData() {
    this.router.post("/vote/random/:numOfVote", async (req, res) => {
      try {
        const allUser = await this.dataSource.userDataSource.getAllListUser();
        const allVote = await this.dataSource.voteDataSource.getAll();
        const hasUser = allUser.reduce((current, item, index) => {
          current[item?.id] = item;
          return current;
        }, {})
        const allUserId = allUser?.map((item) => ({ _id: item?._id }));
        const allStudentId = allUser
          ?.filter((item) => item?.role === Role.STUDENT)
          ?.map?.((item) => ({ _id: item?._id }));
        const allTeacherId = allUser
          ?.filter((item) => item?.role === Role.TEACHER)
          ?.map?.((item) => ({ _id: item?._id }));
        const allTeacherData = allUser.filter?.(item => item?.role === Role.TEACHER);
        const allTutorRequest = await this.dataSource.tutorRequestDataSource.getAll();
        const tutorRequestDone = allTutorRequest.filter((item) => item.status === EStatusRequest.CLASS_ENDED && item?.teacher);
        const numOfVote = req.params.numOfVote;
        const result = [];
        for (let i = 0; i < parseInt(numOfVote); i++) {
          const randomClass = faker.helpers.arrayElement(tutorRequestDone);
          const randomUser = faker.helpers.arrayElement(randomClass.students);
          const isUserVoted = allVote.some(item => item.class === randomClass._id && item.userSend === randomUser._id);
          if (!isUserVoted) {
            const newVote = {
              class: randomClass._id,
              userSend: randomUser._id,
              userReceive: randomClass.teacher._id,
              message: faker.lorem.paragraph(2),
              value: faker.number.int({ min: 1, max: 5 }),
            }
            const data = await this._insertWithSocket(newVote);
            result.push(data);
          }
        }
        return res.send(result);
      } catch (error) {
        console.log(`🔥LOG_IT:: error`, error)
        return res
          .status(ErrorCode.BAD_REQUEST)
          .json({ error: "Get other vote failure!" });
      }
    })
  }
}

export default VoteRouter;
