import User from "../model/user.model";
import { ObjectId } from "mongodb";

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
}

export default UserDataSource;
