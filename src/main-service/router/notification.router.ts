import { IRouter } from "express";
import NotificationDataSource from "../datasource/notificationDataSource";
import ERROR_CODE from "../constant/errorCode";

type IDataSource = {
  notificationDataSource: NotificationDataSource;
};

class NotificationRouter {
  router: IRouter;
  dataSource: IDataSource;
  constructor(router: IRouter, dataSource: IDataSource) {
    this.router = router;
    this.dataSource = dataSource;
    this.registerRoutes();
  }

  registerRoutes() {
    /** registry routes */
    this.getListNotificationByUser();
    this.readNotification();
  }

  private getListNotificationByUser() {
    this.router.get(`/notification/:id`, async (req, res) => {
      try {
        const { id } = req.params || {};
        const response =
          await this.dataSource.notificationDataSource.getNotificationByUser(
            id,
          );
        return res.send(response);
      } catch (e) {
        console.info(`LOG_IT:: getListNotificationByUser e`, e);
        return res
          .sendStatus(ERROR_CODE.BAD_REQUEST)
          .json({ error: "Internal error" });
      }
    });
  }

  private readNotification() {
    this.router.post(`/notification/read/:id`, async (req, res) => {
      try {
        const response =
          await this.dataSource.notificationDataSource.updateNotification(
            { _id: req.params.id },
            {
              isRead: true,
            },
          );
        return res.send(response);
      } catch (e) {
        console.info(`LOG_IT:: readNotification e`, e);
        return res
          .sendStatus(ERROR_CODE.BAD_REQUEST)
          .json({ error: "Internal error" });
      }
    });
  }
}

export default NotificationRouter;
