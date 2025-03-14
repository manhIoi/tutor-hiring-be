import TutorRequest, { EStatusRequest } from "../model/tutor-request.model";

class TutorRequestDataSource {
  getAll() {
    return TutorRequest.find({
      isDeleted: {
        $ne: true,
      },
    })
      .populate("subjects")
      .populate("user")
      .populate("teacher")
      .sort({ lastUpdate: -1 });
  }

  getWithQuery(filter) {
    return TutorRequest.find(filter);
  }

  getAvailableByTeacherId(id) {
    return TutorRequest.find({
      status: EStatusRequest.OPEN,
      isDeleted: {
        $ne: true,
      },
      teacher: {
        $ne: id,
      },
    })
      .populate("subjects")
      .populate("user")
      .populate("teacher")
      .sort({ lastUpdate: -1 });
  }

  getAvailableByStudentId(id) {
    return TutorRequest.find({
      isDeleted: {
        $ne: true,
      },
      user: {
        $ne: id,
      },
      status: {
        $lte: EStatusRequest.HAS_TEACHER,
      },
    })
      .populate("subjects")
      .populate("user")
      .populate("teacher")
      .sort({ lastUpdate: -1 });
  }

  getById(id) {
    return TutorRequest.find({ _id: id })
      .populate("subjects")
      .populate("user")
      .populate("teacher")
      .sort({ lastUpdate: -1 });
  }

  getByUserId(id) {
    return TutorRequest.find({
      $or: [{ user: id }, { students: id }],
      isDeleted: {
        $ne: true,
      },
    })
      .populate("subjects")
      .populate("user")
      .populate("teacher")
      .populate("students")
      .sort({ lastUpdate: -1 });
  }

  insertTutorRequest(tutoRequest) {
    return TutorRequest.insertMany([tutoRequest]);
  }

  insertListTutorRequest(list) {
    return TutorRequest.insertMany(list);
  }

  findAndUpDateWithQuery(filter, newData) {
    return TutorRequest.updateMany(filter, newData, { new: true });
  }

  findAndUpdateTutorRequest(filter, newData) {
    return TutorRequest.findOneAndUpdate(filter, newData, { new: true });
  }

  getByTeacherId(id) {
    return TutorRequest.find({
      teacher: id,
      isDeleted: {
        $ne: true,
      },
    })
      .populate("subjects")
      .populate("user")
      .populate("teacher")
      .sort({ lastUpdate: -1 });
  }

  deleteManyTutorRequest(filter) {
    return TutorRequest.updateMany(filter, { isDeleted: true }, { new: true });
  }
}

export default TutorRequestDataSource;
