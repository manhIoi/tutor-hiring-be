import mongoose from "mongoose";
import { randomDate } from "../utils/date.util";
const { Schema } = mongoose;

export enum EStatusRequest {
  OPEN = 0,
  HAS_TEACHER = 1,
  TEACHER_APPROVAL = 2,
  CLASS_ENDED,
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
  createdAt: {
    type: Date,
    default: randomDate(new Date(2023, 1, 1), new Date()),
  },
  lastUpdate: {
    type: Number,
    default: new Date().getTime(),
  },
});

const TutorRequest = mongoose.model("TutorRequest", tutorRequestSchema);
export default TutorRequest;
