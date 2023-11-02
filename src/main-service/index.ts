import { MongoClient, ServerApiVersion } from "mongodb";
import express from "express";
import dotenv from "dotenv";
import apiRouter from "./router";
import mongoose from "mongoose";
import UserModel from "./model/user.model";
import User from "./model/user.model";
import crawTutor from "../crawl-service/tutor";
import Tutor from "./model/tutor.model";

dotenv.config();
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.kpp4ena.mongodb.net/?retryWrites=true&w=majority`;

export default async () => {
  try {
    const app = express();
    // Connect the client to the server	(optional starting in v4.7)
    app.use(apiRouter);

    app.listen(process.env.PORT, () => {
      console.info(`LOGGER:: start listening in port ${process.env.PORT}`);
    });

    const connection = await mongoose.connect(uri);
  } finally {
  }
};
