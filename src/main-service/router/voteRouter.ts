import { IRouter } from "express";
import VoteDataSource from "../datasource/voteDataSource";
import { verifyJWT } from "../common/middleware";
import ErrorCode from "../constant/errorCode";
import UserDataSource from "../datasource/userDataSource";
import { removeHiddenField } from "../utils/authentication.util";

type IDataSource = {
  voteDataSource: VoteDataSource;
  userDataSource: UserDataSource;
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
  }

  insertVote() {
    this.router.post("/vote/add", verifyJWT, async (req, res) => {
      try {
        const body = req.body;
        const [newVote] = await this.dataSource.voteDataSource.insertVote(body);
        const newUser = await this.dataSource.userDataSource.updateUser(
          { _id: body?.userReceive },
          {
            $push: { votes: newVote?._id },
          },
        );
        return res.send({ newVote, newUser });
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
        return res
          .status(ErrorCode.BAD_REQUEST)
          .json({ error: "Get vote failure!" });
      }
    });
  }
}

export default VoteRouter;
