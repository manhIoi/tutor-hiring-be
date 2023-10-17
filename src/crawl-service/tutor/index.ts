import puppeteer, { Page } from "puppeteer";

interface ITutor {
  id: string;
  avatar: string;
  name: string;
  dateOfBirth: string;
  position: string;
  school: string;
  specialized: string;
  graduationYear: string;
}

async function nextPage(page: Page) {
  const buttonNextSelector: string = ".pgae_l.pagination.clearfix > li > .next";
  const currentUrl = await page.$eval(buttonNextSelector, (ele) =>
    ele.getAttribute("href"),
  );
  const urlSchema = new URL(currentUrl);
  const currentPage = urlSchema.searchParams.get("p");
  return {
    currentPage,
    invoke: () => page.goto(urlSchema.href),
  };
}

async function getTutorFromCurrentPage(page: Page) {
  try {
    const tutorResultSelector: string = ".gs_item_l.clearfix > .gs_item";
    const tutorResult: ITutor[] = await page.$$eval(
      tutorResultSelector,
      (els) => {
        return els.map((e) => {
          const metaInfo = Array.from(e.querySelectorAll(".gs4")).map(
            (e) => e.innerHTML,
          );
          const classes = e
            .querySelector(".gs5th2")
            .textContent.replace("Nhận dạy: ", "")
            .split(", ");
          const [dateOfBirth, position, school, specialized, graduationYear] =
            metaInfo;
          return {
            id: e.querySelector(".gs2").innerHTML,
            avatar: e.querySelector("img").src,
            name: e.querySelector(".gs3").innerHTML,
            dateOfBirth,
            position,
            school,
            specialized,
            graduationYear,
            classes,
          };
        });
      },
    );
    return tutorResult;
  } catch (e) {
    console.info("LOGGER::  ", e);
  }
}

async function getTutorFromMultiPage(page: Page) {
  let tutorResult = [];
  let loop = true;
  do {
    const { currentPage, invoke: invokeNextPage } =
      (await nextPage(page)) || {};
    loop = currentPage !== "2";
    const tutorResultFromSinglePage = await getTutorFromCurrentPage(page);
    tutorResult = [...tutorResult, ...tutorResultFromSinglePage];
    await invokeNextPage();
  } while (loop);
  return tutorResult;
}

const main = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto(process.env.CRAWL_ENDPOINT);
    const tutorResult = await getTutorFromMultiPage(page);
    console.info("LOGGER::-tutorResult", tutorResult);
    await browser.close();
  } catch (e) {
    console.info("LOGGER:: error", e);
  }
};

export default main;
