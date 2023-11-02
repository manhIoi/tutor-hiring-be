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
      const userData = {
        name: "user1",
        age: 20,
      };
      return res.send({ token: new Date().getTime().toString(), ...userData });
    });
  }
}

export default Authentication;
