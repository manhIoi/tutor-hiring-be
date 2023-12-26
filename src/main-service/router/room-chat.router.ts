import UserDataSource from "../datasource/userDataSource";
import { IRouter } from "express";
import RoomChatDataSource from "../datasource/roomChatDataSource";

type IDataSource = {
  roomChatDataSource: RoomChatDataSource;
};

class RoomChatRouter {
  router: IRouter;
  dataSource: IDataSource;
  constructor(router: IRouter, dataSource: IDataSource) {
    this.router = router;
    this.dataSource = dataSource;
    this.registerRoutes();
  }

  registerRoutes() {
    /** registry routes */
    this.getListRoomByUser();
    this.createRoomChat();
    this.updateRoomChat();
    this.joinRoomChat();
  }

  private createRoomChat() {
    this.router.post("/room/create/:id", async (req, res) => {
      try {
        const { id } = req.params || {};
        const { person } = req.body || {};
        const [roomChat] =
          await this.dataSource.roomChatDataSource.insertRoomChatByUser([
            person,
            id,
          ]);
        return res.send(roomChat);
      } catch (e) {
        console.info(`LOGGER:: createRoomChat e`, e);
      }
    });
  }

  private updateRoomChat() {
    try {
      this.router.post("/room/update/:id", async (req, res) => {
        const newData = req.body || {};
        const filter = {
          user: req.params.id,
        };
        const result = this.dataSource.roomChatDataSource.updateRoomChatByUser(
          filter,
          newData,
        );
        return res.send(result);
      });
    } catch (e) {
      console.info(`LOGGER:: updateRoomChat e`, e);
    }
  }

  private getListRoomByUser() {
    this.router.get("/room/:id", async (req, res) => {
      const { id } = req.params || {};
      console.info(`LOGGER:: get list room by user`);
      const listRoom =
        await this.dataSource.roomChatDataSource.getRoomChatById(id);
      const listRoomFiltered = listRoom.filter((room) => !!room?.lastMessage);
      return res.send(listRoomFiltered);
    });
  }

  private joinRoomChat() {
    this.router.post(`/room/join`, async (req, res) => {
      const list = req.body;
      const [p1, p2] = list || [];
      const currentRoom =
        await this.dataSource.roomChatDataSource.getRoomChatDetail({
          $and: [
            {
              persons: {
                $in: [p1],
              },
            },
            {
              persons: {
                $in: [p2],
              },
            },
          ],
        });
      if (!currentRoom) {
        const newRoom =
          await this.dataSource.roomChatDataSource.insertRoomChatByUser(list);
        console.info(`LOG_IT:: newRoom`, newRoom);
        return res.send(newRoom);
      }
      console.info(`LOG_IT:: currentRoom`, currentRoom);
      return res.send(currentRoom);
    });
  }
}

export default RoomChatRouter;
