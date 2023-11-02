import { IRouter } from "express";
import TutorDataSource from "../datasource/tutorDataSource";

class TutorRouter {
  router: IRouter;
  constructor(router: IRouter) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    console.info("LOGGER:: registerRoutes");
    /** registry routes */
    this.getAllTutor();
    this.getSuggestTutor();
  }

  getAllTutor() {
    this.router.get(`/teacherInfo/all`, async (req, res) => {
      const data = await TutorDataSource.getAllListTutor();
      return res.send(data);
    });
  }
  getSuggestTutor() {
    this.router.get(`/teacherInfo/suggest`, async (req, res) => {
      const data = await TutorDataSource.getSuggestTutor();
      return res.send(data);
    });
  }
}

export default TutorRouter;
