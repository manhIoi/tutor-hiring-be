import crawlTutor from "./tutor";
import cron from "node-cron";
export default () => {
  cron.schedule("* * * * *", function () {
    //start job cron
    // crawlTutor();
  });
};
