import mongoose from "mongoose";
const { Schema } = mongoose;

const chatSchema = new Schema({
  userSend: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userReceive: { type: Schema.Types.ObjectId, ref: "User", required: true },
  room: { type: Schema.Types.ObjectId, ref: "RoomChat", required: true },
  content: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
