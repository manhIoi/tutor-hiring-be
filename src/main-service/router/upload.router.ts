import { IRouter } from "express";
import multer from "multer";
import { ref, storage } from "../datasource/firebaseDataSource";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import fs from "fs";

type IDataSource = {};

const readFileAsync = (path: string): any => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const multerStorage = multer.diskStorage({
  destination: "upload",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

class UploadRouter {
  router: IRouter;
  dataSource: IDataSource;
  constructor(router: IRouter, dataSource: IDataSource) {
    this.router = router;
    this.dataSource = dataSource;
    this.registerRoutes();
  }

  registerRoutes() {
    /** registry routes */
    this.uploadImage();
    this.uploadFile();
  }

  private uploadImage() {
    this.router.post(
      "/files/images",
      upload.single("tutor_image"),
      async (req: any, res) => {
        try {
          const { file } = req || {};
          const data = await readFileAsync(file?.path);
          console.info(`LOG_IT:: file`, file);
          const storageRef = ref(storage, `files/${file.originalname}`);
          const metadata = {
            contentType: file.mimetype,
          };
          const snapshot = await uploadBytesResumable(
            storageRef,
            data,
            metadata,
          );
          console.info(`LOG_IT:: snapshot`, snapshot);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          console.info(`LOG_IT:: downloadUrl`, downloadUrl);
          res.send(downloadUrl);
        } catch (e) {
          console.info(`LOG_IT:: uploadImage`, e);
        }
      },
    );
  }

  private uploadFile() {}
}

export default UploadRouter;
