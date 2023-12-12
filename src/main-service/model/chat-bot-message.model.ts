import mongoose from "mongoose";
const { Schema } = mongoose;

const chatBotMessageSchema = new Schema({
  chatBot: { type: Schema.Types.ObjectId, ref: "ChatBot", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, default: "" },
  isBotMessage: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
});

const ChatBotMessage = mongoose.model("ChatBotMessage", chatBotMessageSchema);
export default ChatBotMessage;
