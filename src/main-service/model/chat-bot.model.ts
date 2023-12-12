import mongoose from "mongoose";
const { Schema } = mongoose;

const chatBotSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const ChatBot = mongoose.model("ChatBot", chatBotSchema);
export default ChatBot;
