import User from "../model/user.model";
import ChatBot from "../model/chat-bot.model";
import { Role } from "../../common/model/User";

class UserDataSource {
  getAllListUser() {
    return User.find({
      isDeleted: {
        $ne: true,
      },
    })
      .populate("subjects")
      .select("-password")
      .populate("votes");
  }
  getSuggestUserByRole(role: String) {
    return User.find({
      role,
      isDeleted: {
        $ne: true,
      },
    })
      .populate("subjects")
      .select("-password")
      .populate("votes");
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

  updateUser(filter, newData) {
    return User.findOneAndUpdate(filter, newData, { new: true })
      .select("-password")
      .populate("subjects");
  }

  getUserBecomeTeacher() {
    return User.find({ role: Role.STUDENT, requestBecomeTutor: true });
  }

  deleteManyUser(filter) {
    return User.updateMany(filter, { isDeleted: true }, { new: true });
  }
}

export default UserDataSource;
