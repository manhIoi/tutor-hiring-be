import RoomChat from "../model/room-chat.model";
class RoomChatDataSource {
  getAll() {
    return RoomChat.find({});
  }

  getRoomChatById(idUser) {
    return RoomChat.find({
      persons: { $in: [idUser] },
    })
      .populate("persons")
      .populate("lastMessage")
      .populate({
        path: "idClass",
        populate: {
          path: "students",
        },
      });
  }

  insertRoomChatByUser(persons) {
    return RoomChat.insertMany([{ persons }]);
  }

  insertRoomChatByClass(persons, idClass) {
    return RoomChat.insertMany([{ persons, idClass }]);
  }

  updateRoomChatByUser(filter, newData) {
    return RoomChat.findOneAndUpdate(filter, newData, { new: true });
  }

  getRoomChatDetail(filter) {
    return RoomChat.findOne(filter);
  }
}

export default RoomChatDataSource;
