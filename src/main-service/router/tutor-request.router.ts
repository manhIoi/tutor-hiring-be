import { IRouter } from "express";
import TutorRequestDataSource from "../datasource/tutorRequestDataSource";
import ErrorCode from "../constant/errorCode";
import UserDataSource from "../datasource/userDataSource";
import ERROR_CODE from "../constant/errorCode";

type IDataSource = {
  userDataSource: UserDataSource;
  tutorRequestDataSource: TutorRequestDataSource;
};

class TutorRequestRouter {
  router: IRouter;
  dataSource: IDataSource;
  constructor(router: IRouter, dataSource: IDataSource) {
    this.router = router;
    this.dataSource = dataSource;
    this.registerRoutes();
  }

  registerRoutes() {
    /** registry routes */
    this.getAllTutorRequest();
    this.getTutorRequestByUser();
    this.insertTutorRequest();
    this.insertTutorRequestWithTutor();
  }

  private getAllTutorRequest() {
    this.router.get("/tutor-request/all", async (req, res) => {
      const tutorRequests =
        await this.dataSource.tutorRequestDataSource.getAll();
      return res.send(tutorRequests);
    });
  }

  private getTutorRequestByUser() {
    this.router.get("/tutor-request/:id", async (req, res) => {
      const { id } = req.params;
      const tutorRequests =
        await this.dataSource.tutorRequestDataSource.getByUserId(id);
      return res.send(tutorRequests);
    });
  }

  private insertTutorRequest() {
    this.router.post("/tutor-request/add", async (req, res) => {
      const tutorRequest = req.body;
      console.info("LOGGER:: tutorRequest", tutorRequest);
      // TODO: implement
      tutorRequest.timeStartAt = new Date();
      tutorRequest.timeEndAt = new Date();
      tutorRequest.startAt = new Date();
      if (!tutorRequest) {
        return res.send(ErrorCode.BAD_REQUEST);
      }
      const status =
        await this.dataSource.tutorRequestDataSource.insertTutorRequest(
          tutorRequest,
        );
      console.info("LOGGER:: insertTutorRequest", status);
      return res.send(status);
    });
  }

  private insertTutorRequestWithTutor() {
    this.router.post("/tutor-request/add/:id", async (req, res) => {
      const { id } = req.params;
      const tutorRequest = req.body;
      // TODO: implement
      tutorRequest.timeStartAt = new Date();
      tutorRequest.timeEndAt = new Date();
      tutorRequest.startAt = new Date();
      const currentTeacher =
        await this.dataSource.userDataSource.getUserById(id);
      if (!currentTeacher) {
        return res
          .status(ERROR_CODE.NOT_FOUND)
          .json({ error: "Not founded teacher" });
      }
      tutorRequest.teacher = id;
      const status =
        await this.dataSource.tutorRequestDataSource.insertTutorRequest(
          tutorRequest,
        );
      return res.send(status);
    });
  }
}

export default TutorRequestRouter;
