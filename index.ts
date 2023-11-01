import crawlServiceJob from "./src/crawl-service";
import mainServiceJob from "./src/main-service";
import dotenv from "dotenv";

dotenv.config();
const main = async () => {
  crawlServiceJob();
  mainServiceJob().catch(console.dir);
};

main().catch(console.dir);
