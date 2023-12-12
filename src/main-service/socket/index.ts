import ChatSocket from "./chatSocket";
import ChatDataSource from "../datasource/chatDataSource";
import RoomChatDataSource from "../datasource/roomChatDataSource";

const chatSocket = new ChatSocket(4000, {
  chatDataSource: new ChatDataSource(),
  roomChatDataSource: new RoomChatDataSource(),
});

export { chatSocket };
