import { IRouter } from "express";
import UserDataSource from "../datasource/userDataSource";

class UserRouter {
  router: IRouter;
  constructor(router: IRouter) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    /** registry routes */
    this.getAllUser();
    this.getSuggestUserByRole();
  }

  getAllUser() {
    this.router.get(`/user/all`, async (req, res) => {
      const data = await UserDataSource.getAllListUser();
      return res.send(data);
    });
  }
  getSuggestUserByRole() {
    this.router.get(`/user/:role`, async (req, res) => {
      const role = req.params.role;
      const data = await UserDataSource.getSuggestUserByRole(role);
      return res.send(data);
    });
  }
}

export default UserRouter;
