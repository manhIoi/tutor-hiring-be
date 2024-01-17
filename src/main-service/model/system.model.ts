import mongoose from "mongoose";
const { Schema } = mongoose;

const systemSchema = new Schema({
  systemData: String,
  subjectData: String,
  teacherData: String,
  tutorRequestData: String,
});

const System = mongoose.model("System", systemSchema);
export default System;
