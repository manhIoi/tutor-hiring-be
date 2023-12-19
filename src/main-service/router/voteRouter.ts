import { IRouter } from "express";
import VoteDataSource from "../datasource/voteDataSource";
import { verifyJWT } from "../common/middleware";

type IDataSource = {
  voteDataSource: VoteDataSource;
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
  }

  insertVote() {
    this.router.post("/vote/add", verifyJWT, async (req, res) => {
      const body = req.body;
      return this.dataSource.voteDataSource.insertVote(body);
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
}

export default VoteRouter;
