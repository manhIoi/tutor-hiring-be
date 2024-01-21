import { IRouter } from "express";
import UserDataSource from "../datasource/userDataSource";
import userDataSource from "../datasource/userDataSource";
import ERROR_CODE from "../constant/errorCode";
import { removeHiddenField } from "../utils/authentication.util";
import { faker } from "@faker-js/faker";
import { verifyJWT, verifyRole } from "../common/middleware";
import { Role } from "../../common/model/User";
import VoteDataSource from "../datasource/voteDataSource";
import { getVoteValue } from "../utils/user.util";
import ChatSocket from "../socket/chatSocket";

type IDataSource = {
  userDataSource: UserDataSource;
  voteDataSource: VoteDataSource;
};

type IService = {
  socketService: ChatSocket;
};

class UserRouter {
  router: IRouter;
  dataSource: IDataSource;
  service: IService;

  constructor(router: IRouter, dataSource: IDataSource, service: IService) {
    this.router = router;
    this.dataSource = dataSource;
    this.service = service;
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
    this.deleteManyUser();
    this.rejectBecomeTeacher();
    this.getDetailUser();
  }

  getAllUser() {
    this.router.get(`/user/all`, async (req, res) => {
      try {
        const data = await this.dataSource.userDataSource.getAllListUser();
        return res.send(data);
      } catch (e) {
        console.info(`LOG_IT:: getAllUser`, e);
      }
    });
  }
  getSuggestUserByRole() {
    this.router.get(`/user/:role`, async (req, res) => {
      try {
        const role = req.params.role;
        const data =
          await this.dataSource.userDataSource.getSuggestUserByRole(role);
        const _data = data
          .map((item: any) => {
            const voteValue = getVoteValue(item.votes) || 0;
            return { ...item?._doc, voteValue };
          })
          .sort((a, b) => b.voteValue - a.voteValue);
        return res.send(_data);
      } catch (e) {
        console.info(`LOG_IT:: getSuggestUserByRole e`, e);
      }
    });
  }

  updateUser() {
    this.router.post("/user/update/:id", async (req, res) => {
      try {
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
      } catch (e) {
        console.info(`LOG_IT:: updateUser e`, e);
      }
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
          this.service.socketService.emitEvent(
            `become_teacher_${id}`,
            {
              title: "Thông báo từ admin",
              message: "Xin chúc mừng, bạn đã được duyệt trở thành giáo viên",
              user: id,
            },
            true,
          );
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

  rejectBecomeTeacher() {
    this.router.post(
      "/user/update/reject-become-teacher/:id",
      verifyJWT,
      verifyRole(Role.ADMIN),
      async (req, res) => {
        try {
          const { id } = req.params || {};
          const { message } = req.body || {};
          const newData = await this.dataSource.userDataSource.updateUser(
            { _id: id, requestBecomeTutor: true },
            { role: Role.STUDENT, requestBecomeTutor: false },
          );
          console.info(`LOG_IT:: newData`, newData);
          if (!newData) {
            return res
              .status(ERROR_CODE.BAD_REQUEST)
              .json({ error: "Update profile failed" });
          }

          this.service.socketService.emitEvent(
            `become_teacher_${id}`,
            {
              title: "Thông báo từ admin",
              message: `Bạn bị từ chối với lý do: ${message}`,
              user: id,
            },
            true,
          );

          return res.send(removeHiddenField(newData));
        } catch (e) {
          console.info(`LOG_IT:: e rejectBecomeTeacher`, e);
          return res
            .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
            .json({ error: "Call Api Exception" });
        }
      },
    );
  }

  deleteManyUser() {
    this.router.delete(
      "/user/delete",
      verifyJWT,
      verifyRole(Role.ADMIN),
      async (req, res) => {
        try {
          const list = req.body;
          const filter = {
            _id: {
              $in: list,
            },
          };
          console.info(`LOG_IT:: filter`, filter);
          const response =
            await this.dataSource.userDataSource.deleteManyUser(filter);
          console.info(`LOG_IT:: response`, response);
          return res.send(response);
        } catch (e) {
          console.info(`LOG_IT:: e deleteManyUser`, e);
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

  private getDetailUser() {
    this.router.get("/user/detail/:id", verifyJWT, async (req, res) => {
      try {
        const { id } = req.params || {};
        const user = await this.dataSource.userDataSource.getUserById(id);
        return res.send(removeHiddenField(user));
      } catch (e) {
        console.info(`LOG_IT:: e getDetailUser`, e);
        return res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .json({ error: "Call Api Exception" });
      }
    });
  }
}

export default UserRouter;
