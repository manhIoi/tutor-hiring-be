import { IRouter } from "express";
import UserDataSource from "../datasource/userDataSource";
import userDataSource from "../datasource/userDataSource";

type IDataSource = {
  userDataSource: UserDataSource;
};

class UserRouter {
  router: IRouter;
  dataSource: IDataSource;
  constructor(router: IRouter, dataSource: IDataSource) {
    this.router = router;
    this.dataSource = dataSource;
    this.registerRoutes();
  }

  registerRoutes() {
    /** registry routes */
    this.getAllUser();
    this.getSuggestUserByRole();
  }

  getAllUser() {
    this.router.get(`/user/all`, async (req, res) => {
      const data = await this.dataSource.userDataSource.getAllListUser();
      return res.send(data);
    });
  }
  getSuggestUserByRole() {
    this.router.get(`/user/:role`, async (req, res) => {
      const role = req.params.role;
      const data =
        await this.dataSource.userDataSource.getSuggestUserByRole(role);
      return res.send(data);
    });
  }
}

export default UserRouter;
