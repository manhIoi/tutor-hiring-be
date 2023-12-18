import { IRouter } from "express";
import UserDataSource from "../datasource/userDataSource";
import userDataSource from "../datasource/userDataSource";
import ERROR_CODE from "../constant/errorCode";
import { removeHiddenField } from "../utils/authentication.util";
import { faker } from "@faker-js/faker";
import { verifyJWT, verifyRole } from "../common/middleware";
import { Role } from "../../common/model/User";

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
    this.updateUser();
    this.approveBecomeTeacher();
    this.getListUserRequestBecomeTeacher();
    this.insertRandomUser();
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

  updateUser() {
    this.router.post("/user/update/:id", async (req, res) => {
      const { id } = req.params || {};
      const data = req.body;
      const newData = await this.dataSource.userDataSource.updateUser(
        { _id: id },
        data,
      );
      if (!newData) {
        return res
          .status(ERROR_CODE.BAD_REQUEST)
          .json({ error: "Update profile failed" });
      }
      return res.send(removeHiddenField(newData));
    });
  }

  getListUserRequestBecomeTeacher() {
    this.router.get(
      "/user/become-teacher/all",
      verifyJWT,
      verifyRole(Role.ADMIN),
      async (req, res) => {
        try {
          const response =
            await this.dataSource.userDataSource.getUserBecomeTeacher();
          return res.send(response);
        } catch (e) {
          console.info(`LOG_IT:: e getListUserRequestBecomeTeacher`, e);
          return res
            .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
            .json({ error: "Call Api Exception" });
        }
      },
    );
  }

  approveBecomeTeacher() {
    this.router.post(
      "/user/update/become-teacher/:id",
      verifyJWT,
      verifyRole(Role.ADMIN),
      async (req, res) => {
        try {
          const { id } = req.params || {};
          const newData = await this.dataSource.userDataSource.updateUser(
            { _id: id, requestBecomeTutor: true },
            { role: Role.TEACHER },
          );
          console.info(`LOG_IT:: newData`, newData);
          if (!newData) {
            return res
              .status(ERROR_CODE.BAD_REQUEST)
              .json({ error: "Update profile failed" });
          }
          return res.send(removeHiddenField(newData));
        } catch (e) {
          console.info(`LOG_IT:: e approveBecomeTeacher`, e);
          return res
            .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
            .json({ error: "Call Api Exception" });
        }
      },
    );
  }

  insertRandomUser() {
    this.router.post("/user/random/:numberOfUser", async (req, res) => {
      const { numberOfUser } = req.params;
      const result = [];
      for (let i = 0; i < parseInt(numberOfUser); i++) {
        const mockUser = {
          role: "student",
          fullName: faker.person.fullName(),
          phone: faker.phone.number("0#########"),
          dob: faker.number.int({ min: 2001, max: 2015 }).toString(),
          avatar: faker.image.avatar(),
          address: faker.location.streetAddress(true),
          // fullName: String,
          // phone: String,
          // password: {
          //   type: String,
          //   default: "",
          // },
          // dob: String,
          // avatar: String,
          // role: {
          //   type: String,
          //   enum: ["teacher", "student"],
          //   default: "student",
          // },
          // subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
          // votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
          // metaData: userMetaDataSchema,
          // address: String,
          // position: {
          //   type: String,
          //   default: null,
          // },
        };
        const [newUser] =
          await this.dataSource.userDataSource.insertUser(mockUser);
        const [newChatBot] = await this.dataSource.userDataSource.insertChatBot(
          { user: newUser?._id },
        );
        result.push({ newUser, newChatBot });
      }
      return res.send(result);
    });
  }
}

export default UserRouter;
