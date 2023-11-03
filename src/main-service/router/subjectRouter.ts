import { IRouter } from "express";
import SubjectDataSource from "../datasource/subjectDataSource";
import ERROR_CODE from "../constant/errorCode";

class SubjectRouter {
  router: IRouter;
  constructor(router: IRouter) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    /** registry routes */
    this.getAllSubject();
    this.insertSubject();
    this.deleteSubjectById();
  }

  private getAllSubject() {
    this.router.get("subject/all", async (req, res) => {
      const subjects = await SubjectDataSource.getAll();
      if (!subjects) {
        return res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ error: "Get subject fail" });
      }
      return res.send(subjects);
    });
  }

  private insertSubject() {
    this.router.post("subject/add", async (req, res) => {
      const { subject } = req.body;
      const newSubject = await SubjectDataSource.insertSubject(subject);
      return res.send(newSubject);
    });
  }

  private deleteSubjectById() {
    this.router.post("subject/delete/:id", async (req, res) => {
      const { id } = req.params;
      const status = await SubjectDataSource.deleteSubject(id);
      if (!status) {
        return res.status(201).json({ error: "Delete fail" });
      }
      return res.send(status);
    });
  }
}

export default SubjectRouter;
