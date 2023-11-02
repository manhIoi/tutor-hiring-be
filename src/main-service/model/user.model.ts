import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: String,
  phone: String,
  dob: String,
  avatar: {
    large: String,
    medium: String,
  },
  access: {
    type: String,
    enum: ["teacher", "student"],
  },
});

const User = mongoose.model("User", userSchema);
export default User;
