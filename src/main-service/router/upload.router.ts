import { IRouter } from "express";

type IDataSource = {};

class UploadRouter {
  router: IRouter;
  dataSource: IDataSource;
  constructor(router: IRouter, dataSource: IDataSource) {
    this.router = router;
    this.dataSource = dataSource;
    this.registerRoutes();
  }

  registerRoutes() {
    /** registry routes */
    this.uploadImage();
    this.uploadFile();
  }

  private uploadImage() {
    this.router.post("/files/images", (req, res) => {
      console.info(`LOG_IT:: req body `, JSON.stringify(req.body));
    });
  }

  private uploadFile() {}
}

export default UploadRouter;
