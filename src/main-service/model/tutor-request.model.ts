import mongoose from "mongoose";
const { Schema } = mongoose;

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
    default: 0,
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
});

const TutorRequest = mongoose.model("TutorRequest", tutorRequestSchema);
export default TutorRequest;
