import crawlServiceJob from "./src/crawl-service";
import express from "express";
import dotenv from "dotenv";
const PORT = 3000;

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
dotenv.config();
app.use(express.static("public", options));
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ data: { errorDesc: "Welcome to tutor hiring service" } });
});

app.listen(PORT, () => {
  console.info(`LOGGER:: start listening in port ${PORT}`);
});

const main = () => {
  // crawlServiceJob();
};

main();
