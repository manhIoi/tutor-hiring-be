import mongoose from "mongoose";
const { Schema } = mongoose;

const subjectSchema = new Schema({ name: String });

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
