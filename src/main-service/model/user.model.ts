import mongoose from "mongoose";
const { Schema } = mongoose;

const userMetaDataSchema = new Schema({
  description: String,
});

const userSchema = new Schema({
  fullName: String,
  phone: String,
  dob: String,
  avatar: String,
  role: {
    type: String,
    enum: ["teacher", "student"],
  },
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  metaData: userMetaDataSchema,
  address: String,
});

const User = mongoose.model("User", userSchema);
export default User;
