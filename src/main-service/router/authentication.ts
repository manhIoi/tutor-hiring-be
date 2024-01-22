import { IRouter } from "express";
import UserDataSource from "../datasource/userDataSource";
import ERROR_CODE from "../constant/errorCode";
import jwt from "jsonwebtoken";
import {
  genPassword,
  comparePassword,
  removeHiddenField,
} from "../utils/authentication.util";
import { checkDuplicateAccount } from "../middleware/verifySignUp";
import { isEmpty } from "lodash";
import { verifyJWT } from "../common/middleware";

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
    this.updatePassword();
    this.forgotPassword();
    this.verifyOtp();
    this.resetPassword();
    this.wakeUpServer();
  }

  private resetPassword() {
    this.router.post("/users/reset-password", async (req, res) => {
      try {
        const { phone, newPassword } = req.body || {};
        const passwordHashed = await genPassword(newPassword);
        await this.dataSource.userDataSource.updateUser(
          { phone },
          { password: passwordHashed },
        );
        return res.send({ status: true });
      } catch (e) {
        console.info(`LOG_IT:: login e`, e);
        return res
          .sendStatus(ERROR_CODE.BAD_REQUEST)
          .json({ error: "Internal error" });
      }
    });
  }

  login() {
    this.router.post("/user/login", async (req, res) => {
      try {
        const { phone, password } = req.body;
        console.info("LOGGER:: phone, password", phone, password);
        const user = await this.dataSource.userDataSource.getUserByPhone(phone);
        console.info("LOGGER:: user", user);
        if (isEmpty(user) || user?.isDeleted === true) {
          return res.json({
            error: "Không tìm thấy người dùng. Vui lòng kiểm tra lại",
          });
        }
        const isCorrectPassword = await comparePassword(
          password,
          user?.password,
        );
        if (!isCorrectPassword && user?.password) {
          return res.json({ error: "Mật khẩu không đúng. Vui lòng thử lại !" });
        }
        const [chatBot] = await this.dataSource.userDataSource.getChatBotByUser(
          user._id,
        );
        return res.send({
          token: jwt
            .sign({ phone: user.phone, _id: user._id, role: user.role }, "key")
            .toString(),
          user: removeHiddenField(user),
          chatBot: isEmpty(chatBot)
            ? await this.dataSource.userDataSource.insertChatBot({
                user: user?._id,
              })
            : chatBot,
        });
      } catch (e) {
        console.info(`LOG_IT:: login e`, e);
        return res
          .sendStatus(ERROR_CODE.BAD_REQUEST)
          .json({ error: "Internal error" });
      }
    });
  }

  register() {
    this.router.post(
      "/user/register",
      checkDuplicateAccount,
      async (req, res) => {
        try {
          const { fullName, phone, dob, avatar, address, password } =
            req.body || {};
          const userData = {
            fullName,
            phone,
            role: "student",
            password: await genPassword(password),
            avatar: `https://ui-avatars.com/api/?background=random&name=${fullName}`,
          };
          console.info("LOGGER:: userData", userData);
          const [newUser] =
            await this.dataSource.userDataSource.insertUser(userData);
          const [newChatBot] =
            await this.dataSource.userDataSource.insertChatBot({
              user: newUser?._id,
            });
          console.info("LOGGER:: newUser", newUser, newChatBot);
          if (!newUser) {
            return res
              .json(ERROR_CODE.BAD_REQUEST)
              .json({ error: "Register failed" });
          }
          return res.send({
            token: jwt
              .sign({ phone: newUser?.phone, _id: newUser?._id }, "key")
              .toString(),
            user: removeHiddenField(newUser),
            chatBot: newChatBot,
          });
        } catch (e) {
          console.info(`LOG_IT:: register e`, e);
          return res
            .sendStatus(ERROR_CODE.BAD_REQUEST)
            .json({ error: "Internal error" });
        }
      },
    );
  }

  private verifyOtp() {
    this.router.post("/users/verify-otp", async (req, res) => {
      try {
        const { code } = req.body;
        if (code === "000000") {
          setTimeout(() => {
            return res.send({ status: true });
          }, 1000);
        } else {
          return res.json({ error: "Otp không chính xác" });
        }
      } catch (e) {
        return res
          .sendStatus(ERROR_CODE.BAD_REQUEST)
          .json({ error: "Internal error" });
      }
    });
  }

  private forgotPassword() {
    this.router.post("/user/forgot-password", async (req, res) => {
      try {
        const { phone } = req.body || {};
        const currentUser =
          await this.dataSource.userDataSource.getUserByPhone(phone);
        if (currentUser) {
          return res.send(currentUser);
        }
        return res.json({ error: "Không tìm thấy người dùng" });
      } catch (e) {
        return res
          .sendStatus(ERROR_CODE.BAD_REQUEST)
          .json({ error: "Internal error" });
      }
    });
  }

  private updatePassword() {
    this.router.post("/user/update-password", verifyJWT, async (req, res) => {
      try {
        const { currentPassword, newPassword, _id } = req.body || {};
        const currentUser =
          await this.dataSource.userDataSource.getUserById(_id);
        const isCorrectPassword = await comparePassword(
          currentPassword,
          currentUser?.password,
        );
        const newPasswordHashed = await genPassword(newPassword);
        console.info(
          `LOG_IT:: update password`,
          currentUser,
          isCorrectPassword,
          newPasswordHashed,
          currentUser?.password === "",
        );
        if (!currentUser?.password || isCorrectPassword) {
          const newData = await this.dataSource.userDataSource.updateUser(
            { _id },
            { password: newPasswordHashed },
          );
          return res.send(newData);
        }
        return res
          .status(ERROR_CODE.BAD_REQUEST)
          .json({ error: "Password not correct" });
      } catch (e) {
        return res
          .status(ERROR_CODE.BAD_REQUEST)
          .json({ error: "Update password fail" });
      }
    });
  }

  private wakeUpServer() {
    this.router.get("/wake-up", (req, res) => {
      try {
        return res.send("wake-up !!!");
      } catch (e) {
        return res
          .status(ERROR_CODE.BAD_REQUEST)
          .json({ error: "wake up fail" });
      }
    });
  }
}

export default Authentication;
