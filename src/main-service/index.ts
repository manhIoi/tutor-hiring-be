import express from "express";
import dotenv from "dotenv";
import apiRouter from "./router";
import mongoose from "mongoose";
import crawlTutor from "../crawl-service/tutor";
import * as http from "http";
import { Server } from "socket.io";

dotenv.config();
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.kpp4ena.mongodb.net/?retryWrites=true&w=majority`;

export default async () => {
  try {
    const app = express();
    const server = http.createServer(app);

    app.use(express.json());
    app.use(apiRouter);
    server.listen(process.env.PORT, () => {
      console.info(`LOGGER:: start listening in port ${process.env.PORT}`);
    });

    let users = [];

    const io = new Server(server);
    io.on("connection", (socket) => {
      console.info(`🔥🔥🔥LOGGER:: `);
      socket.on("message", (data) => {
        console.info("🔥LOGGER:: data ", data);
        io.emit("messageResponse", data);
      });

      //Listens when a new user joins the server
      socket.on("newUser", (data) => {
        users.push(data);
        io.emit("newUserResponse", users);
      });

      socket.on("typing", (data) =>
        socket.broadcast.emit("typingResponse", data),
      );

      socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
        //Updates the list of users when a user disconnects from the server
        users = users.filter((user) => user.socketID !== socket.id);
        // console.log(users);
        //Sends the list of users to the client
        io.emit("newUserResponse", users);
        socket.disconnect();
      });
    });
    await mongoose.connect(uri);
    await crawlData();
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
