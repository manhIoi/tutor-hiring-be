import SocketIO from "socket.io";
import ChatDataSource from "../datasource/chatDataSource";
import OpenAI from "openai";
import dotenv from "dotenv";
import RoomChatDataSource from "../datasource/roomChatDataSource";
import NotificationDataSource from "../datasource/notificationDataSource";

interface IDataSource {
  chatDataSource: ChatDataSource;
  roomChatDataSource: RoomChatDataSource;
  notificationDataSource: NotificationDataSource;
}

class ChatSocket {
  io: SocketIO;
  users: any[];
  dataSource: IDataSource;
  constructor(port: number, dataSource: IDataSource) {
    this.io = SocketIO(port);
    this.dataSource = dataSource;
    this.users = [];
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

  private buildNotificationData() {}

  initSocket() {
    dotenv.config();
    const openai = new OpenAI({
      apiKey: process.env.GPT_API_KEY,
    });
    const io = this.io;
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
        }) => {
          const createdAt = new Date().getTime();
          console.log(`🔥LOG_IT:: createdAt`, createdAt, roomId)
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
            openai.chat.completions
              .create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: content }],
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
                  createdAt: new Date().getTime(),
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
        const listUserReceive = [tutorRequest?.user, ...tutorRequest?.students];
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
  }
}

export default ChatSocket;
