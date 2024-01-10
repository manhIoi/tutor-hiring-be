import ChatSocket from "./chatSocket";
import ChatDataSource from "../datasource/chatDataSource";
import RoomChatDataSource from "../datasource/roomChatDataSource";
import NotificationDataSource from "../datasource/notificationDataSource";

const chatSocket = new ChatSocket(3000, {
  chatDataSource: new ChatDataSource(),
  roomChatDataSource: new RoomChatDataSource(),
  notificationDataSource: new NotificationDataSource(),
});

export { chatSocket };
