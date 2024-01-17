import { IRouter } from "express";
import ChatDataSource from "../datasource/chatDataSource";
import ERROR_CODE from "../constant/errorCode";
import TutorRequestDataSource from "../datasource/tutorRequestDataSource";

type IDataSource = {
  chatDataSource: ChatDataSource;
  tutorRequestDataSource: TutorRequestDataSource;
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
}

export default ChatRouter;
