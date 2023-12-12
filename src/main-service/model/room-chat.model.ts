import mongoose from "mongoose";
const { Schema } = mongoose;

const roomChatSchema = new Schema({
  persons: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lastMessage: { type: Schema.Types.ObjectId, ref: "Chat" },
});

const RoomChat = mongoose.model("RoomChat", roomChatSchema);
export default RoomChat;
