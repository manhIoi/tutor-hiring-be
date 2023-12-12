import mongoose from "mongoose";
const { Schema } = mongoose;

export enum EStatusRequest {
  OPEN = 0,
  TEACHER_APPROVAL = 1,
  CLOSE = 2,
}

const tutorRequestSchema = new Schema({
  title: String,
  description: String,
  content: String,
  address: String,
  startAt: {
    type: Date,
    default: new Date(),
  },
  endAt: {
    type: Date,
    default: new Date(),
  },
  timeStart: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: Number,
    default: EStatusRequest.OPEN,
  },
  timeline: Number, //
  weekDays: [Number], // range of monday to sunday
  price: Number, // price 1 day
  isOnline: Boolean,
  numOfStudents: Number,
  contact: String,
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // user created
  teacher: { type: Schema.Types.ObjectId, ref: "User" }, // teacher owner class
  students: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isTeacherApproved: { type: Boolean, default: false },
});

const TutorRequest = mongoose.model("TutorRequest", tutorRequestSchema);
export default TutorRequest;
