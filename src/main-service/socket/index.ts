import ChatSocket from "./chatSocket";
import ChatDataSource from "../datasource/chatDataSource";
import RoomChatDataSource from "../datasource/roomChatDataSource";
import NotificationDataSource from "../datasource/notificationDataSource";
import SystemDataSource from "../datasource/systemDataSource";

const chatSocket = new ChatSocket(4000, {
  chatDataSource: new ChatDataSource(),
  roomChatDataSource: new RoomChatDataSource(),
  notificationDataSource: new NotificationDataSource(),
  systemDataSource: new SystemDataSource(),
});

export { chatSocket };
