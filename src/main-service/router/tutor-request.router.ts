import { IRouter } from "express";
import TutorRequestDataSource from "../datasource/tutorRequestDataSource";
import ErrorCode from "../constant/errorCode";
import UserDataSource from "../datasource/userDataSource";
import ERROR_CODE from "../constant/errorCode";
import { faker } from "@faker-js/faker";
import { randomDate } from "../utils/date.util";
import { EStatusRequest } from "../model/tutor-request.model";
import SubjectDataSource from "../datasource/subjectDataSource";
import { isFullStudent } from "../utils/tutor-request.util";
import { verifyJWT, verifyRole } from "../common/middleware";
import { Role } from "../../common/model/User";
import ChatSocket from "../socket/chatSocket";

type IDataSource = {
  userDataSource: UserDataSource;
  tutorRequestDataSource: TutorRequestDataSource;
  subjectDataSource: SubjectDataSource;
};

type IService = {
  socketService: ChatSocket;
};

class TutorRequestRouter {
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
    this.getAllTutorRequest();
    this.getTutorRequestByUser();
    this.insertTutorRequest();
    this.insertTutorRequestWithTutor();
    this.getTutorRequestDetail();
    this.updateTutorRequestDetail();
    this.getTutorRequestAvailable();
    this.getTutorRequestByTeacher();
    this.jobUpdateTutorRequestStatus();
    this.getTutorRequestWithQuery();
    this.insertRandomTutorRequest();
    this.deleteManyTutorRequest();
  }

  private getAllTutorRequest() {
    this.router.get(
      "/tutor-request/all",
      verifyJWT,
      verifyRole(Role.ADMIN),
      async (req, res) => {
        try {
          const tutorRequests =
            await this.dataSource.tutorRequestDataSource.getAll();
          console.info(`🔥LOGGER:: tutorRequests`, tutorRequests);
          return res.send(tutorRequests);
        } catch (e) {
          console.info(`LOG_IT:: e getAllTutorRequest`, e);
          return res
            .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
            .json({ error: "Call Api Exception" });
        }
      },
    );
  }

  private getTutorRequestAvailable() {
    this.router.get("/tutor-request/available/:id", async (req, res) => {
      try {
        console.info(`🔥LOGGER:: req.params.id `, req.params.id);
        const currentUser = await this.dataSource.userDataSource.getUserById(
          req.params.id,
        );
        console.info(`🔥LOGGER:: currentUser `, currentUser);
        if (currentUser.role === Role.TEACHER) {
          const tutorRequests =
            await this.dataSource.tutorRequestDataSource.getAvailableByTeacherId(
              currentUser._id,
            );
          return res.send(tutorRequests);
        }
        const tutorRequests =
          await this.dataSource.tutorRequestDataSource.getAvailableByStudentId(
            currentUser._id,
          );
        const tutorRequestFilter = tutorRequests.filter(
          (item) => !isFullStudent(item),
        );
        return res.send(tutorRequestFilter);
      } catch (e) {
        console.info(`LOG_IT:: e getTutorRequestAvailable`, e);
        return res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .json({ error: "Call Api Exception" });
      }
    });
  }

  private getTutorRequestByUser() {
    this.router.get("/tutor-request/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const tutorRequests =
          await this.dataSource.tutorRequestDataSource.getByUserId(id);
        return res.send(tutorRequests);
      } catch (e) {
        console.info(`LOG_IT:: e getTutorRequestByUser`, e);
        return res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .json({ error: "Call Api Exception" });
      }
    });
  }

  private getTutorRequestByTeacher() {
    this.router.get("/tutor-request/teacher/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const tutorRequests =
          await this.dataSource.tutorRequestDataSource.getByTeacherId(id);
        return res.send(tutorRequests);
      } catch (e) {
        console.info(`LOG_IT:: e getTutorRequestByTeacher`, e);
        return res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .json({ error: "Call Api Exception" });
      }
    });
  }

  private getTutorRequestWithQuery() {
    this.router.post("/tutor-request/query", async (req, res) => {
      try {
        const tutorRequest =
          await this.dataSource.tutorRequestDataSource.getWithQuery(req.body);
        return res.send(tutorRequest);
      } catch (e) {
        console.info(`LOG_IT:: e getTutorRequestWithQuery`, e);
        return res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .json({ error: "Call Api Exception" });
      }
    });
  }

  private insertTutorRequest() {
    this.router.post("/tutor-request/add", async (req, res) => {
      try {
        const tutorRequest = req.body;
        tutorRequest.lastUpdate = new Date().getTime();
        console.info("LOGGER:: tutorRequest", tutorRequest);
        if (!tutorRequest) {
          return res.send(ErrorCode.BAD_REQUEST);
        }
        const status =
          await this.dataSource.tutorRequestDataSource.insertTutorRequest(
            tutorRequest,
          );
        console.info("LOGGER:: insertTutorRequest", status);
        return res.send(status);
      } catch (e) {
        console.info(`LOG_IT:: e insertTutorRequest`, e);
        return res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .json({ error: "Call Api Exception" });
      }
    });
  }

  private insertTutorRequestWithTutor() {
    this.router.post("/tutor-request/add/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const tutorRequest = req.body;
        const currentTeacher =
          await this.dataSource.userDataSource.getUserById(id);

        console.info(`🔥LOGGER:: currentTeacher`, currentTeacher);
        if (!currentTeacher) {
          return res
            .status(ERROR_CODE.NOT_FOUND)
            .json({ error: "Not founded teacher" });
        }
        tutorRequest.teacher = {
          _id: id,
        };
        tutorRequest.lastUpdate = new Date().getTime();
        const status =
          await this.dataSource.tutorRequestDataSource.insertTutorRequest(
            tutorRequest,
          );
        return res.send(status);
      } catch (e) {
        console.info(`LOG_IT:: e insertTutorRequestWithTutor`, e);
        return res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .json({ error: "Call Api Exception" });
      }
    });
  }

  private getTutorRequestDetail() {
    this.router.get("/tutor-request/detail/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const tutorRequest =
          await this.dataSource.tutorRequestDataSource.getById(id);
        if (!tutorRequest) {
          return res
            .status(ERROR_CODE.NOT_FOUND)
            .json({ error: "Not founded request" });
        }
        return res.send(tutorRequest);
      } catch (e) {
        console.info(`LOG_IT:: e getTutorRequestDetail`, e);
        return res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .json({ error: "Call Api Exception" });
      }
    });
  }

  private updateTutorRequestDetail() {
    this.router.post("/tutor-request/detail/update/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const newData = req.body;
        console.info(`LOG_IT:: newData`, newData);
        const filter = {
          _id: id,
        };
        const status =
          await this.dataSource.tutorRequestDataSource.findAndUpdateTutorRequest(
            filter,
            { ...newData, lastUpdate: new Date().getTime() },
          );
        console.info(`LOG_IT:: updateTutorRequestDetail`, status);
        return res.send(status);
      } catch (e) {
        console.info(`LOG_IT:: e updateTutorRequestDetail`, e);
        return res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .json({ error: "Call Api Exception" });
      }
    });
  }

  private jobUpdateTutorRequestStatus() {
    this.router.get(
      "/tutor-request/update/check-available",
      async (req, res) => {
        console.log(`🔥LOG_IT:: job`,);
        try {
          const currentDate = new Date();
          const filter = {
            endAt: {
              $lte: currentDate,
            },
          };
          const newData = {
            status: EStatusRequest.CLASS_ENDED,
          };

          const response =
            await this.dataSource.tutorRequestDataSource.findAndUpDateWithQuery(
              filter,
              newData,
            );
          return res.send(response);
        } catch (e) {
          console.info(`LOG_IT:: e updateTutorRequestDetail`, e);
          return res
            .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
            .json({ error: "Call Api Exception" });
        }
      },
    );
  }

  private deleteManyTutorRequest() {
    this.router.delete("/tutor-request/delete", verifyJWT, async (req, res) => {
      try {
        const list = req.body;
        const filter = {
          _id: {
            $in: list,
          },
        };
        console.info(`LOG_IT:: filter deleteManyTutorRequest`, filter);
        const response =
          await this.dataSource.tutorRequestDataSource.deleteManyTutorRequest(
            filter,
          );
        console.info(`LOG_IT:: response deleteManyTutorRequest`, response);
        return res.send(response);
      } catch (e) {
        console.info(`LOG_IT:: e deleteManyTutorRequest`, e);
        return res
          .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
          .json({ error: "Call Api Exception" });
      }
    });
  }

  private insertRandomTutorRequest() {
    this.router.post(
      "/tutor-request/random/:numberRandom",
      async (req, res) => {
        try {
          const allUser = await this.dataSource.userDataSource.getAllListUser();
          const allUserId = allUser?.map((item) => ({ _id: item?._id }));
          const allStudentId = allUser
            ?.filter((item) => item?.role === Role.STUDENT)
            ?.map?.((item) => ({ _id: item?._id }));
          const allTeacherId = allUser
            ?.filter((item) => item?.role === Role.TEACHER)
            ?.map?.((item) => ({ _id: item?._id }));
          const allTeacherData = allUser.filter?.(item => item?.role === Role.TEACHER);
          const allSubject = await this.dataSource.subjectDataSource.getAll();
          const allSubjectId = allSubject?.map((item) => ({ _id: item?._id }));
          const lastUpdate = new Date().getTime();
          const { numberRandom } = req.params;
          const result = [];
          const resultDeleteSubject = [];
          for (let i = 0; i < parseInt(numberRandom); i++) {

            console.log(`🔥LOG_IT:: i`, i)
            const mockData = {
              title: faker.lorem.words({ min: 3, max: 7 }),
              price: faker.number.int({ min: 1000000, max: 3000000 }),
              description: faker.lorem.paragraph(2),
              content: faker.lorem.lines(3),
              address: faker.location.streetAddress(true),
              startAt: randomDate(new Date(2023, 4, 31), new Date(2023, 6, 30)),
              endAt: randomDate(new Date(2023, 7, 1), new Date(2023, 12, 31)),
              timeline: faker.number.int({ min: 1, max: 3 }) * 60,
              weekDays: faker.helpers.rangeToNumber({ min: 1, max: 7 }), // 5
              isOnline: faker.datatype.boolean(),
              numOfStudents: faker.number.int({ min: 1, max: 30 }),
              createdAt: new Date(),
              subjects: faker.helpers.arrayElements(
                allSubjectId,
                1
              ),
              contact: faker.phone.number("0#########"),
              user: faker.helpers.arrayElement(allStudentId),

              status: faker.number.int({ min: 0, max: 2 }),

              lastUpdate: faker.number.int({
                min: lastUpdate,
                max: lastUpdate + faker.number.int({ min: 1000, max: 20000 }),
              }),
              teacher: faker.helpers.arrayElement(allTeacherId),
            };
            const _students = faker.helpers.arrayElements(allStudentId, faker.number.int({ min: 1, max: Math.max(mockData.numOfStudents - 2, 1) }),)
            const _studentsFilter = _students.filter(item => item !== mockData.user);
            const students = [mockData.user, ..._studentsFilter];
            const currentTeacher = allTeacherData.find(item => item?._id === mockData.teacher?._id);
            if (currentTeacher?.subjects.length > 0) {
              const subject = faker.helpers.arrayElement(currentTeacher?.subjects)._id
              mockData.subjects = [subject]
              const shouldHasTeacher = mockData.status !== 0;
              !shouldHasTeacher && delete mockData["teacher"];
              const isWaitingTeacherApprove =
                mockData?.teacher &&
                mockData.numOfStudents === 1 &&
                students?.length === 1;
              const getStatus = () => {
                if (mockData.endAt.getTime() <= new Date().getTime()) {
                  return 3;
                }
                if (isWaitingTeacherApprove) {
                  return faker.number.int({ min: 1, max: 2 });
                }
                return mockData?.status;
              };
              result.push({ ...mockData, students, status: getStatus() });
            }
          }

          console.info(`LOG_IT:: result`, result);
          console.info(`LOG_IT:: result`, resultDeleteSubject);

          if (!result?.length) return;

          const resultImport =
            await this.dataSource.tutorRequestDataSource.insertListTutorRequest(
              result,
            );

          return res.send(resultImport);

          //     title: String,
          //     description: String,
          //     content: String,
          //     address: String,
          //     startAt: {
          //   type: Date,
          // default: new Date(),
          // },
          // endAt: {
          //   type: Date,
          // default: new Date(),
          // },
          // timeStart: {
          //   type: Date,
          // default: new Date(),
          // },
          // status: {
          //   type: Number,
          // default: EStatusRequest.OPEN,
          // },
          // timeline: Number, //
          //     weekDays: [Number], // range of monday to sunday
          //     price: Number, // price 1 day
          //     isOnline: Boolean,
          //     numOfStudents: Number,
          //     contact: String,
          //     subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
          //     user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // user created
          // teacher: { type: Schema.Types.ObjectId, ref: "User" }, // teacher owner class
          // students: [{ type: Schema.Types.ObjectId, ref: "User" }],
          //     isTeacherApproved: { type: Boolean, default: false },
          // createdAt: {
          //   type: Date,
          // default: randomDate(new Date(2023, 1, 1), new Date()),
          // },
        } catch (e) {
          console.log(`🔥LOG_IT:: e`, e)
        }
      },
    );
  }
}

export default TutorRequestRouter;
