import { IRouter } from "express";

class Authentication {
  router: IRouter;
  constructor(router: IRouter) {
    this.router = router;
    this.registerRoutes();
  }
  registerRoutes() {
    // TODO: type in login
    this.router.post("/user/login/teacher", (req, res) => {
      return res.send("Login success");
    });
  }
}

export default Authentication;
