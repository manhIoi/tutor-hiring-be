import { IRouter } from "express";
import ChatDataSource from "../datasource/chatDataSource";
import ERROR_CODE from "../constant/errorCode";
import TutorRequestDataSource from "../datasource/tutorRequestDataSource";
import SubjectDataSource from "../datasource/subjectDataSource";
import UserDataSource from "../datasource/userDataSource";
import SystemDataSource from "../datasource/systemDataSource";

type IDataSource = {
  chatDataSource: ChatDataSource;
  tutorRequestDataSource: TutorRequestDataSource;
  subjectDataSource: SubjectDataSource;
  userDataSource: UserDataSource;
  systemDataSource: SystemDataSource;
};

class ChatRouter {
  router: IRouter;
  dataSource: IDataSource;
  constructor(router: IRouter, dataSource: IDataSource) {
    this.router = router;
    this.dataSource = dataSource;
    this.registerRoutes();
  }

  registerRoutes() {
    /** registry routes */
    this.getAllMessage();
    this.getMessagesByRoom();
    this.getListRoomByUser();
    this.getListMessageByClass();
    this.updateBaseSystemData();
  }

  private getMessagesByRoom() {
    this.router.post("/chat/room", async (req, res) => {
      try {
        const { idReceive, idSend, isChatBot = false } = req.body;
        if (!idSend || !idReceive) {
          return res
            .status(ERROR_CODE.BAD_REQUEST)
            .json({ error: "Data incorrect" });
        }

        if (isChatBot) {
          const messages =
            await this.dataSource.chatDataSource.getChatBotMessageByUser(
              idSend,
            );
          return res.send(messages);
        }

        const messages = await this.dataSource.chatDataSource.getChatByRoom(
          idReceive,
          idSend,
        );

        console.info(`🔥LOGGER:: messages`, messages);

        return res.send(messages);
      } catch (e) {
        console.info(`🔥LOGGER:: getMessagesByRoom`, e);
      }
    });
  }
  private getListRoomByUser() {
    this.router.get("/chat/list/:id", async (req, res) => {
      try {
        const { id } = req.params || {};
        console.info(`LOGGER:: id`, id);
        const messages =
          await this.dataSource.chatDataSource.getListRomByUser(id);
        console.info(`LOGGER:: messages`, messages);
        return res.send(messages);
      } catch (e) {
        console.info(`LOGGER:: e getListRoomByUser`, e);
      }
    });
  }

  private getListMessageByClass() {
    this.router.post("/chat/room-class/:idClass", async (req, res) => {
      try {
        const { idClass } = req.params || {};
        const [currentClass] =
          await this.dataSource.tutorRequestDataSource.getById(idClass);
        const { students } = currentClass || {};
        const listMessage =
          await this.dataSource.chatDataSource.getChatByClass(idClass);
        return res.send(listMessage);
      } catch (e) {}
    });
  }

  private getAllMessage() {
    this.router.get("/chat/all", async (req, res) => {
      try {
        const result = await this.dataSource.chatDataSource.getAll();
        return res.send(result);
      } catch (e) {}
    });
  }

  private updateBaseSystemData() {
    this.router.get("/chat/train-data", async (req, res) => {
      try {
        const listSubject = await this.dataSource.subjectDataSource.getAll();
        const listTeacher =
          await this.dataSource.userDataSource.getSuggestUserByRole("teacher");
        const systemData = [
          "Người phát triển ứng dụng này là Phạm Mạnh Lợi, Học trường Công nghệ thông tin, Mã số sinh viên là 19521772",
          "Ứng dụng này tên là EduMentor",
          `Thông tin cập nhật mới nhất vào ${new Date()}`,
        ];
        const subjectData = [
          `Có tổng cộng ${listSubject.length} khóa học đang được mở`,
        ];
        const teacherData = [
          `Có tổng cộng ${listTeacher.length} giáo viên trong hệ thống`,
        ];
        const [value] =
          (await this.dataSource.systemDataSource.getSystemDataSource()) || [];
        const _newData = {
          systemData: `Bạn là trợ giảng thông minh. Bạn trả lời câu hỏi người dùng dựa vào các thông tin hiện có sau: ${systemData.join(
            "\n\n",
          )}`,
          subjectData: `Bạn là trợ giảng thông minh. Bạn trả lời câu hỏi người dùng dựa vào các thông tin hiện có sau: ${subjectData}`,
          teacherData: `Bạn là trợ giảng thông minh. Bạn trả lời câu hỏi người dùng dựa vào các thông tin hiện có sau: ${teacherData}`,
        };
        if (!value) {
          const newData =
            await this.dataSource.systemDataSource.insertSystemDataSource(
              _newData,
            );
          return res.send(newData);
        } else {
          const newData =
            await this.dataSource.systemDataSource.updateSystemDataSource(
              { _id: value?._id },
              _newData,
            );
          return res.send(newData);
        }
      } catch (e) {}
    });
  }
}

export default ChatRouter;
