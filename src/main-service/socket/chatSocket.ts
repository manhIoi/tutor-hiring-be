import SocketIO from "socket.io";
import ChatDataSource from "../datasource/chatDataSource";
import OpenAI from "openai";
import dotenv from "dotenv";
import RoomChatDataSource from "../datasource/roomChatDataSource";
import NotificationDataSource from "../datasource/notificationDataSource";
import { buildMessageBaseSystemInformation } from "../utils/chatAi.util";
import SystemDataSource from "../datasource/systemDataSource";

interface IDataSource {
  chatDataSource: ChatDataSource;
  roomChatDataSource: RoomChatDataSource;
  notificationDataSource: NotificationDataSource;
  systemDataSource: SystemDataSource;
}

class ChatSocket {
  io: SocketIO | null;
  users: any[];
  dataSource: IDataSource;
  systemData: any;
  constructor(port: number, dataSource: IDataSource) {
    this.io = null;
    this.dataSource = dataSource;
    this.users = [];
    this.systemData = {};
  }

  async emitEvent(eventName, data, createNotification = false) {
    if (createNotification) {
      const [notification] =
        await this.dataSource.notificationDataSource.saveNotification(data);
      console.info(`LOG_IT:: new notification`, notification);
      this.io.emit(eventName, notification);
    } else {
      this.io.emit(eventName, data);
    }
  }

  private bindSystemData(data) {
    console.info(`LOG_IT:: keyof`);
    const _data = Object.keys(data?._doc)?.reduce((current, item) => {
      if (!["_id", "__v"].includes(item)) {
        return {
          ...current,
          [item]: data._doc[item],
        };
      }
      return current;
    }, {});
    console.info(`LOG_IT:: _data`, _data);

    this.systemData = _data;
  }

  private buildNotificationData() {}

  initInstance(server) {
    this.io = SocketIO.listen(server);
  }

  initSocket() {
    try {
      dotenv.config();
      const openai = new OpenAI({
        apiKey: process.env.GPT_API_KEY,
      });
      const io = this.io;
      this.dataSource.systemDataSource.getSystemDataSource().then((data) => {
        this.bindSystemData(data?.[0]);
      });
      io.on("connection", (socket) => {
        console.info(`🔥🔥🔥LOGGER:: new connection ${socket.id}`);
        socket.on(
          `message`,
          ({
            content,
            idReceive,
            idSend,
            isChatBot = false,
            isBotMessage = false,
            roomId,
            isChatGroup = false,
            listIdReceive = [],
            idClass,
          }) => {
            console.info(
              `LOG_IT:: isChatGroup, listIdReceive`,
              isChatGroup,
              listIdReceive,
            );
            if (isChatGroup) {
              this.handleChatGroup({
                listIdReceive,
                idSend,
                roomId,
                content,
                io,
                idClass,
              });

              return;
            }

            const createdAt = new Date();
            console.log(`🔥LOG_IT:: createdAt`, createdAt, roomId);
            const executeNewMessage = isChatBot
              ? this.dataSource.chatDataSource.saveChatBotMessageByUser
              : this.dataSource.chatDataSource.saveMessage;
            const newMessage = isChatBot
              ? {
                  chatBot: {
                    _id: idReceive,
                  },
                  user: {
                    _id: idSend,
                  },
                  isBotMessage,
                  content,
                  createdAt,
                }
              : {
                  userSend: {
                    _id: idSend,
                  },
                  userReceive: {
                    _id: idReceive,
                  },
                  content,
                  createdAt,
                  room: roomId,
                };
            executeNewMessage(newMessage).then(async (result) => {
              console.info(`🔥🔥🔥LOGGER::  result`, result);
              if (!isChatBot) {
                const tmp =
                  await this.dataSource.roomChatDataSource.updateRoomChatByUser(
                    { _id: roomId },
                    {
                      lastMessage: result[0]._id,
                    },
                  );
                console.info(`LOGGER:: tmp`, tmp);
                return;
              }
              console.info(
                `LOG_IT:: this.systemData on message`,
                this.systemData,
              );
              openai.chat.completions
                .create({
                  model: "gpt-3.5-turbo",
                  messages: buildMessageBaseSystemInformation(this.systemData, {
                    role: "user",
                    content: content,
                  }),
                })
                .then((completionText) => {
                  const { choices } = completionText || {};
                  const { content: botContent } = choices[0].message || {};
                  console.info(`LOGGER:: choices`, JSON.stringify(choices));
                  console.info(`LOGGER:: messageSendTo_${idReceive}`);
                  const botMessage = {
                    chatBot: {
                      _id: idReceive,
                    },
                    user: {
                      _id: idSend,
                    },
                    isBotMessage: true,
                    content: botContent,
                    createdAt: new Date(),
                  };
                  io.emit(`messageSendTo_${idSend}`, {
                    receive: true,
                    content: botContent,
                    createdAt,
                  });
                  executeNewMessage(botMessage);
                });
            });
            io.emit(`messageResponse_${idSend}`, {
              receive: false,
              content,
              createdAt,
              status: true,
            });
            if (isChatBot) {
              return;
            }
            io.emit(`messageSendTo_${idReceive}`, {
              receive: true,
              content,
              createdAt,
            });
          },
        );

        //Listens when a new user joins the server
        socket.on("newUser", (data) => {
          this.users.push(data);
          io.emit("newUserResponse", this.users);
        });

        socket.on("typing", (data) =>
          socket.broadcast.emit("typingResponse", data),
        );

        socket.on("joinClass", (data) => {
          console.info(`LOG_IT:: data`, JSON.stringify(data));
          const { tutorRequest, userId } = data || {};
          const listUserReceive = [
            tutorRequest?.user,
            ...tutorRequest?.students,
          ];
          tutorRequest?.teacher && listUserReceive.push(tutorRequest?.teacher);
          const listUserFiltered = listUserReceive.filter(
            (item) => item !== userId,
          );
          const listNotification = listUserFiltered.map((id) => ({
            user: id,
            message: `Có thông báo mới về lớp học ${tutorRequest?._id}`,
            data: JSON.stringify({
              typeNotification: "tutor_request",
              id: tutorRequest?._id,
            }),
          }));

          this.dataSource.notificationDataSource
            .saveListNotification(listNotification)
            .then((values) => {
              values.forEach((notification) => {
                io.emit(`notify_${notification.user}`, notification);
              });
            });
        });

        socket.on("disconnect", () => {
          console.log("🔥: A user disconnected");
          //Updates the list of users when a user disconnects from the server
          this.users = this.users.filter((user) => user.socketID !== socket.id);
          // console.log(users);
          //Sends the list of users to the client
          io.emit("newUserResponse", this.users);
          socket.disconnect();
        });
      });
    } catch (e) {
      console.info(`LOG_IT:: e init socket`, e);
    }
  }

  private handleChatGroup({
    listIdReceive,
    idSend,
    roomId,
    content,
    io,
    idClass,
  }) {
    const newMessage = {
      userSend: {
        _id: idSend,
      },
      content,
      createdAt: new Date(),
      room: roomId,
      idClass,
    };
    this.dataSource.chatDataSource.saveMessage(newMessage).then((result) => {
      console.info(`LOG_IT:: result`, result);
      this.dataSource.roomChatDataSource
        .updateRoomChatByUser(
          { _id: roomId },
          {
            lastMessage: result[0]._id,
          },
        )
        .then((value) => {
          console.info(`LOG_IT:: value`, value);
        });
    });
    io.emit(`messageResponse_${idSend}`, {
      receive: false,
      content,
      createdAt: new Date(),
      status: true,
    });
    listIdReceive.forEach?.((item) => {
      if (item === idSend) return;
      io.emit(`messageSendTo_${item}`, {
        receive: true,
        content,
        createdAt: new Date(),
        idSend: idSend,
      });
    });
  }
}

export default ChatSocket;
