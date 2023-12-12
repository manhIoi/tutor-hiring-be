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
    this.getTutorRequestDetail();
    this.updateTutorRequestDetail();
    this.getTutorRequestAvailable();
    this.getTutorRequestByTeacher();
  }

  private getAllTutorRequest() {
    this.router.get("/tutor-request/all", async (req, res) => {
      const tutorRequests =
        await this.dataSource.tutorRequestDataSource.getAll();
      console.info(`🔥LOGGER:: tutorRequests`, tutorRequests);
      return res.send(tutorRequests);
    });
  }

  private getTutorRequestAvailable() {
    this.router.get("/tutor-request/available/:id", async (req, res) => {
      console.info(`🔥LOGGER:: req.params.id `, req.params.id);
      const currentUser = await this.dataSource.userDataSource.getUserById(
        req.params.id,
      );
      console.info(`🔥LOGGER:: currentUser `, currentUser);
      if (currentUser.role === "teacher") {
        const tutorRequests =
          await this.dataSource.tutorRequestDataSource.getAvailableByTeacherId(
            currentUser._id,
          );
        return res.send(tutorRequests);
      }
      const tutorRequests =
        await this.dataSource.tutorRequestDataSource.getAvailableByStudentId(
          currentUser._id,
        );
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

  private getTutorRequestByTeacher() {
    this.router.get("/tutor-request/teacher/:id", async (req, res) => {
      const { id } = req.params;
      const tutorRequests =
        await this.dataSource.tutorRequestDataSource.getByTeacherId(id);
      return res.send(tutorRequests);
    });
  }

  private insertTutorRequest() {
    this.router.post("/tutor-request/add", async (req, res) => {
      const tutorRequest = req.body;
      console.info("LOGGER:: tutorRequest", tutorRequest);
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
      try {
        const { id } = req.params;
        const tutorRequest = req.body;
        const currentTeacher =
          await this.dataSource.userDataSource.getUserById(id);

        console.info(`🔥LOGGER:: currentTeacher`, currentTeacher);
        if (!currentTeacher) {
          return res
            .status(ERROR_CODE.NOT_FOUND)
            .json({ error: "Not founded teacher" });
        }
        tutorRequest.teacher = {
          _id: id,
        };
        const status =
          await this.dataSource.tutorRequestDataSource.insertTutorRequest(
            tutorRequest,
          );
        return res.send(status);
      } catch (e) {
        console.info(`🔥LOGGER:: error insertTutorRequestWithTutor`, e);
      }
    });
  }

  private getTutorRequestDetail() {
    this.router.get("/tutor-request/detail/:id", async (req, res) => {
      const { id } = req.params;
      const tutorRequest =
        await this.dataSource.tutorRequestDataSource.getById(id);
      if (!tutorRequest) {
        return res
          .status(ERROR_CODE.NOT_FOUND)
          .json({ error: "Not founded request" });
      }
      return res.send(tutorRequest);
    });
  }

  private updateTutorRequestDetail() {
    this.router.post("/tutor-request/detail/update/:id", async (req, res) => {
      const { id } = req.params;
      const newData = req.body;
      const filter = {
        _id: id,
      };
      const status =
        await this.dataSource.tutorRequestDataSource.findAndUpdateTutorRequest(
          filter,
          newData,
        );
      return res.send(status);
    });
  }
}

export default TutorRequestRouter;
