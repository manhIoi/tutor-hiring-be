import mongoose from "mongoose";
const { Schema } = mongoose;
const subjectSchema = new Schema({ name: String });

const tutorSchema = new Schema({
  fullName: String,
  subject: [subjectSchema],
  address: String,
  avatar: String,
  rate: Number,
  description: String,
});

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;
