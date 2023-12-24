import Notification from "../model/notification.model";

class NotificationDataSource {
  getAll() {
    return Notification.find({});
  }

  getNotificationByUser(id) {
    return Notification.find({
      user: id,
    });
  }

  saveNotification(notification) {
    return Notification.insertMany([notification]);
  }
  saveListNotification(list) {
    return Notification.insertMany(list);
  }

  updateNotification(filter, newData) {
    return Notification.findOneAndUpdate(filter, newData, { new: true });
  }
}

export default NotificationDataSource;
