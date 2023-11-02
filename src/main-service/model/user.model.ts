import mongoose from "mongoose";
const { Schema } = mongoose;

const subjectSchema = new Schema({ name: String });

const userSchema = new Schema({
  fullName: String,
  phone: String,
  dob: String,
  avatar: String,
  role: {
    type: String,
    enum: ["teacher", "student"],
  },
  subjects: [subjectSchema],
});

const User = mongoose.model("User", userSchema);
export default User;
