import express from "express";
import dotenv from "dotenv";
import apiRouter from "./router";
import mongoose from "mongoose";
import crawlTutor from "../crawl-service/tutor";
import * as http from "http";
import { chatSocket } from "./socket";
import cors from "cors";

dotenv.config();
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.kpp4ena.mongodb.net/?retryWrites=true&w=majority`;

export default async () => {
  try {
    const app = express();
    const server = http.createServer(app);

    app.use(cors());
    app.use(express.json());
    app.use(apiRouter);
    // init socket
    chatSocket.initInstance(server);
    chatSocket.initSocket();
    server.listen(process.env.PORT, () => {
      console.info(`LOGGER:: start listening in port ${process.env.PORT}`);
    });

    // socket service init

    await mongoose.connect(uri);
    await crawlData();
  } catch (e) {
    console.info(`🔥LOGGER:: e`, e);
  } finally {
  }
};

async function crawlData() {
  /** crawl subject **/
  // const subjects = await crawlSubject();
  // const result = await SubjectModel.insertMany(subjects);
  // console.info("LOGGER:: ", result);
  const rawData = await crawlTutor();
  // const formattedData = rawData.map((item) => ({
  //   fullName: item.name,
  //   phone: Math.floor(100000000 + Math.random() * 900000000).toString(),
  //   dob: item.dateOfBirth,
  //   avatar: item.avatar,
  //   role: "teacher",
  //   subjects: item.classes.map((c) => ({ name: c })),
  // }));
  // formattedData.push({
  //   fullName: "Pham Manh Loi",
  //   phone: "0935123335",
  //   dob: "05/05/2001",
  //   avatar:
  //     "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fimage&psig=AOvVaw3xwGzryLsg3W9k1TQYPx2s&ust=1699024206893000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCIiOlsTMpYIDFQAAAAAdAAAAABAE",
  //   role: "student",
  //   subjects: [{ name: "Toán" }],
  // });
  // formattedData.push({
  //   fullName: "Pham Manh Loi",
  //   phone: "0935123335",
  //   dob: "05/05/2001",
  //   avatar:
  //     "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fimage&psig=AOvVaw3xwGzryLsg3W9k1TQYPx2s&ust=1699024206893000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCIiOlsTMpYIDFQAAAAAdAAAAABAE",
  //   role: "teacher",
  //   subjects: [{ name: "Toán" }],
  // });
  // await User.insertMany(formattedData);
}
