import Chat from "../model/chat.model";
import ChatBotMessage from "../model/chat-bot-message.model";

class ChatDataSource {
  getAll() {
    return Chat.find({});
  }

  getChatByRoom(idReceive, idSend) {
    return Chat.find({
      $or: [
        { userSend: idSend, userReceive: idReceive },
        { userSend: idReceive, userReceive: idSend },
      ],
    });
  }

  getChatBotMessageByUser(id) {
    return ChatBotMessage.find({
      user: id,
    });
  }

  getListRomByUser(id) {
    return Chat.find({
      $or: [{ userSend: id }, { userReceive: id }],
    }).sort({ createdAt: -1 });
  }

  saveChatBotMessageByUser(message) {
    return ChatBotMessage.insertMany([message]);
  }

  saveMessage(message) {
    return Chat.insertMany([message]);
  }
}

export default ChatDataSource;
