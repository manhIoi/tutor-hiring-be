import { IRouter } from "express";
import UserDataSource from "../datasource/userDataSource";
import ERROR_CODE from "../constant/errorCode";
import jwt from "jsonwebtoken";
import { genPassword, comparePassword } from "../utils/authentication.util";
import { checkDuplicateAccount } from "../middleware/verifySignUp";
import { isEmpty } from "lodash";

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
      const { phone, password } = req.body;
      console.info("LOGGER:: phone, password", phone, password);
      const user = await this.dataSource.userDataSource.getUserByPhone(phone);
      console.info("LOGGER:: user", user);
      if (isEmpty(user)) {
        return res
          .status(ERROR_CODE.NOT_FOUND)
          .json({ error: "Không tìm thấy người dùng. Vui lòng kiểm tra lại" });
      }
      const isCorrectPassword = await comparePassword(password, user.password);
      if (!isCorrectPassword) {
        return res
          .status(ERROR_CODE.BAD_REQUEST)
          .json({ error: "Mật khẩu không đúng. Vui lòng thử lại !" });
      }
      return res.send({
        token: jwt.sign({ phone: user.phone, _id: user._id }, "key").toString(),
        user,
      });
    });
  }

  register() {
    this.router.post(
      "/user/register",
      checkDuplicateAccount,
      async (req, res) => {
        const { fullName, phone, dob, avatar, address, password } =
          req.body || {};
        const userData = {
          fullName,
          phone,
          dob,
          avatar,
          address,
          password: await genPassword(password),
        };
        console.info("LOGGER:: userData", userData);
        const [newUser] =
          await this.dataSource.userDataSource.insertUser(userData);
        console.info("LOGGER:: newUser", newUser);
        if (!newUser) {
          return res
            .json(ERROR_CODE.BAD_REQUEST)
            .json({ error: "Register failed" });
        }
        return res.send({
          token: jwt
            .sign({ phone: newUser?.phone, _id: newUser?._id }, "key")
            .toString(),
          user: newUser,
        });
      },
    );
  }
}

export default Authentication;
