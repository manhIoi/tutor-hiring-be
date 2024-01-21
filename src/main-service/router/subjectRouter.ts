import { IRouter } from "express";
import SubjectDataSource from "../datasource/subjectDataSource";
import ERROR_CODE from "../constant/errorCode";

type IDataSource = {
  subjectDataSource: SubjectDataSource;
};

class SubjectRouter {
  router: IRouter;
  dataSource: IDataSource;
  constructor(router: IRouter, dataSource) {
    this.router = router;
    this.registerRoutes();
    this.dataSource = dataSource;
  }

  registerRoutes() {
    /** registry routes */
    this.getAllSubject();
    this.insertSubject();
    this.deleteSubjectById();
  }

  private getAllSubject() {
    this.router.get("/subject/all", async (req, res) => {
      try {
        const subjects = await this.dataSource.subjectDataSource.getAll();
        if (!subjects) {
          return res
            .status(ERROR_CODE.NOT_FOUND)
            .send({ error: "Get subject fail" });
        }
        return res.send(subjects);
      } catch (e) {
        console.info(`LOG_IT:: getAllSubject e`, e);
      }
    });
  }

  private insertSubject() {
    this.router.post("/subject/add", async (req, res) => {
      try {
        const { subject } = req.body;
        const newSubject =
          await this.dataSource.subjectDataSource.insertSubject(subject);
        return res.send(newSubject);
      } catch (e) {
        console.info(`LOG_IT:: insertSubject e`, e);
      }
    });
  }

  private deleteSubjectById() {
    this.router.post("/subject/delete/:id", async (req, res) => {
      try {
        // TODO: implement
        const { id } = req.params;
        // const status = await SubjectDataSource.deleteSubject(id);
        // if (!status) {
        //   return res.status(201).json({ error: "Delete fail" });
        // }
        return res.send(null);
      } catch (e) {}
    });
  }
}

export default SubjectRouter;
