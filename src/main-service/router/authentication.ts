import { IRouter } from "express";
import UserDataSource from "../datasource/userDataSource";

class Authentication {
  router: IRouter;
  constructor(router: IRouter) {
    this.router = router;
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
      const user = await UserDataSource.getUserByPhone(phone);
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
