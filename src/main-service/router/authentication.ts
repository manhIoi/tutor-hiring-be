import { IRouter } from "express";
import UserDataSource from "../datasource/userDataSource";
import ERROR_CODE from "../constant/errorCode";

type IDataSource = {
  userDataSource: UserDataSource;
};

class Authentication {
  router: IRouter;
  dataSource: IDataSource;
  constructor(router: IRouter, dataSource: IDataSource) {
    this.router = router;
    this.dataSource = dataSource;
    this.registerRoutes();
  }
  registerRoutes() {
    // TODO: type in login
    this.login();
    this.register();
  }

  login() {
    this.router.post("/user/login", async (req, res) => {
      const { phone } = req.body;
      const user = await this.dataSource.userDataSource.getUserByPhone(phone);
      if (!user) {
        return res
          .status(ERROR_CODE.NOT_FOUND)
          .json({ error: "Không tìm thấy người dùng. Vui lòng kiểm tra lại" });
      }
      return res.send({ token: new Date().getTime().toString(), user });
    });
  }

  register() {
    this.router.post("/user/register", (req, res) => {
      const userData = {
        name: "user1",
        age: 20,
      };
      return res.send({ token: new Date().getTime().toString(), ...userData });
    });
  }
}

export default Authentication;
