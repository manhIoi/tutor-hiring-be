import mongoose from "mongoose";
import { type } from "os";
const { Schema } = mongoose;

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
