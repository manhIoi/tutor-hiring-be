import User from "../model/user.model";

class UserDataSource {
  getAllListUser() {
    return User.find({});
  }
  getSuggestUserByRole(role) {
    return User.find({ role });
  }

  getUserByPhone(phone) {
    return User.findOne({ phone });
  }
}

export default new UserDataSource();
