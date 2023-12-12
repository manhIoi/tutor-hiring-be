import User from "../model/user.model";
import { ObjectId } from "mongodb";
import ChatBot from "../model/chat-bot.model";

class UserDataSource {
  getAllListUser() {
    return User.find({}).populate("subjects");
  }
  getSuggestUserByRole(role: String) {
    return User.find({ role }).populate("subjects");
  }

  getUserByPhone(phone: String) {
    return User.findOne({ phone }).populate("subjects");
  }

  getUserById(id) {
    return User.findOne({ _id: id }).populate("subjects");
  }

  insertUser(user) {
    return User.insertMany([user]);
  }

  getChatBotByUser(id) {
    return ChatBot.find({ user: id });
  }

  insertChatBot(chatBot) {
    return ChatBot.insertMany([chatBot]);
  }
}

export default UserDataSource;
