import User from "../model/user.model";
import { ObjectId } from "mongodb";

class UserDataSource {
  getAllListUser() {
    return User.find({});
  }
  getSuggestUserByRole(role: String) {
    return User.find({ role });
  }

  getUserByPhone(phone: String) {
    return User.findOne({ phone });
  }

  getUserById(id) {
    return User.findOne({ _id: id });
  }
}

export default UserDataSource;
