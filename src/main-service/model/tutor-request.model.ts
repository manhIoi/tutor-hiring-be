import mongoose from "mongoose";
const { Schema } = mongoose;

const tutorRequestSchema = new Schema({
  title: String,
  description: String,
  content: String,
  address: String,
  startAt: Date,
  timeline: String, //
  weekDays: Number, // range of monday to sunday
  price: Number, // price 1 day
  timeStartAt: Date,
  isOnline: Boolean,
  timeEndAt: Date,
  numOfStudents: Number,
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // user created
  teacher: { type: Schema.Types.ObjectId, ref: "User" }, // teacher owner class
});

const TutorRequest = mongoose.model("TutorRequest", tutorRequestSchema);
export default TutorRequest;
