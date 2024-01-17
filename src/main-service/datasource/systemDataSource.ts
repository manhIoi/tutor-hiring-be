import System from "../model/system.model";

class SystemDataSource {
  getSystemDataSource() {
    return System.find({});
  }

  updateSystemDataSource(filter, newData) {
    return System.findOneAndUpdate(filter, newData, { new: true });
  }

  insertSystemDataSource(newData) {
    return System.insertMany([newData]);
  }
}

export default SystemDataSource;
