import mongoose from "mongoose";
import { Role } from "../../common/model/User";
const { Schema } = mongoose;

const userMetaDataSchema = new Schema({
  description: String,
  gender: {
    type: Number,
    enum: [0, 1],
  },
  email: String,
  university: String,
  signature: String,
  identityCard: [String],
  certificate: [String],
});

const userSchema = new Schema({
  fullName: String,
  phone: String,
  password: {
    type: String,
    default: "",
  },
  dob: String,
  avatar: String,
  role: {
    type: String,
    default: Role.STUDENT,
  },
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
  metaData: userMetaDataSchema,
  address: String,
  position: {
    type: String,
    default: null,
  },
  requestBecomeTutor: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
