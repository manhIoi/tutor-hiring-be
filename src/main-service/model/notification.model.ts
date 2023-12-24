import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  message: String,
  data: String,
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
