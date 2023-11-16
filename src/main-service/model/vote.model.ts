import mongoose from "mongoose";
const { Schema } = mongoose;

const voteSchema = new Schema({
  userSend: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userReceive: { type: Schema.Types.ObjectId, ref: "User", required: true },
  value: { type: Number, required: true },
});

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
