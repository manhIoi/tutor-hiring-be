import puppeteer, { Browser, Page } from "puppeteer";
import SubjectModel from "../../main-service/model/subject.model";
import User from "../../main-service/model/user.model";

interface ITutor {
  id: string;
  avatar: string;
  name: string;
  dateOfBirth: string;
  position: string;
  school: string;
  specialized: string;
  graduationYear: string;
  address: string;
  metaData: {
    description: string;
  };
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
            address: e
              .querySelectorAll(".gs5th")[1]
              .textContent.replace("Khu vực: ", ""),
            metaData: {
              description: e
                .querySelector(".gs9")
                .textContent.replace("Thông tin khác:", ""),
            },
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

async function getTutorSinglePage1(page: Page) {
  const tutorSelector = ".teacher-item";
  const hrefTutors = await page.$$eval(tutorSelector, (elements) => {
    return elements.map((e) => {
      return e.querySelector(".titleTeacher").getAttribute("href");
    });
  });
  const list = hrefTutors.map((i) => {
    return async () => {
      await page.goto(`https://www.daykemtainha.vn${i}`);
      const teacherProfile = await page.$eval(".teacher-prolile-01", (e) => {
        const extraData = e.querySelectorAll(".profile__courses__right > li");
        return {
          avatar: e.querySelector(".teacher-contact > img").getAttribute("src"),
          name: e.querySelector(".teacher-contact > img").getAttribute("alt"),
          dateOfBirth: extraData[0].textContent,
          position: extraData[1].textContent,
          address: extraData[2].textContent,
          subjects: extraData[3].textContent.split(", "),
          metaData: {
            description: e.querySelector(".all-courses > p").textContent,
          },
        };
      });
      // console.info("LOGGER:: ", teacherProfile);
      await page.goBack();
      return teacherProfile;
    };
  });
  const tutorList = [];
  for (const promise of list) {
    const value = await promise();
    tutorList.push(value);
  }
  const subjectArr = await SubjectModel.find({});
  const subjectHash = subjectArr.reduce((current, item, index) => {
    return {
      ...current,
      [item.name]: item,
    };
  }, {});
  console.info("LOGGER:: subjectHash", subjectHash);
  const tutorListFormatted = tutorList.map((tutor) => ({
    avatar: tutor.avatar,
    fullName: tutor.name,
    dob: tutor.dateOfBirth,
    phone: Math.floor(100000000 + Math.random() * 900000000).toString(),
    role: "teacher",
    address: tutor.address,
    metaData: tutor.metaData,
    subjects: tutor.subjects.map((s) => subjectHash[s]._id),
    position: tutor.position,
  }));
  const status = await User.insertMany(tutorListFormatted);
  console.info("LOGGER:: status", status);
}

const main = async () => {
  // try {
  //   const browser = await puppeteer.launch({
  //     headless: false,
  //   });
  //   const page = await browser.newPage();
  //   await page.goto(process.env.CRAWL_ENDPOINT);
  //   const tutorResult = await getTutorFromMultiPage(page);
  //   console.info("LOGGER::-tutorResult", tutorResult);
  //   await browser.close();
  //   return tutorResult;
  // } catch (e) {
  //   console.info("LOGGER:: error", e);
  // }
  // try {
  //   const browser = await puppeteer.launch({
  //     headless: false,
  //   });
  //   const page = await browser.newPage();
  //
  //   const numOfPage = 10;
  //   for (let i = 0; i < numOfPage; i++) {
  //     await page.goto(`https://www.daykemtainha.vn/gia-su?page=${i + 1}`);
  //     await getTutorSinglePage1(page);
  //   }
  // } catch (e) {
  //   console.info("LOGGER:: error", e);
  // }
};

export default main;
