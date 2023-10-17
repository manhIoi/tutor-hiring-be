import { MongoClient, ServerApiVersion } from "mongodb";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.kpp4ena.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export default async () => {
  try {
    const app = express();
    const options = {
      dotfiles: "ignore",
      etag: false,
      extensions: ["htm", "html"],
      index: false,
      maxAge: "1d",
      redirect: false,
      setHeaders(res, path, stat) {
        res.set("x-timestamp", Date.now());
      },
    };

    // Connect the client to the server	(optional starting in v4.7)
    app.use(express.static("public", options));
    app.get("/", (_, response) =>
      response
        .status(200)
        .json({ data: { errorDesc: "Welcome to tutor hiring service" } }),
    );

    app.listen(process.env.PORT, () => {
      console.info(`LOGGER:: start listening in port ${process.env.PORT}`);
    });

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "LOGGER:: Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    await client.close();
  }
};
