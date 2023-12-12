import RoomChat from "../model/room-chat.model";
class RoomChatDataSource {
  getAll() {
    return RoomChat.find({});
  }

  getRoomChatById(idUser) {
    return RoomChat.find({
      user: idUser,
    })
      .populate("persons")
      .populate("lastMessage");
  }

  insertRoomChatByUser(user, person) {
    return RoomChat.insertMany([
      {
        user,
        persons: [person],
      },
    ]);
  }

  updateRoomChatByUser(filter, newData) {
    return RoomChat.findOneAndUpdate(filter, newData, { new: true });
  }

  getRoomChatDetail(filter) {
    return RoomChat.findOne(filter);
  }
}

export default RoomChatDataSource;
