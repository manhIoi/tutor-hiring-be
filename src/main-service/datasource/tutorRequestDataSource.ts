import TutorRequest, { EStatusRequest } from "../model/tutor-request.model";

class TutorRequestDataSource {
  getAll() {
    return TutorRequest.find({})
      .populate("subjects")
      .populate("user")
      .populate("teacher");
  }

  getAvailableByTeacherId(id) {
    return TutorRequest.find({
      status: EStatusRequest.OPEN,
      teacher: {
        $ne: id,
      },
    })
      .populate("subjects")
      .populate("user")
      .populate("teacher");
  }

  getAvailableByStudentId(id) {
    return TutorRequest.find({
      status: EStatusRequest.OPEN,
      user: id,
    })
      .populate("subjects")
      .populate("user")
      .populate("teacher");
  }

  getById(id) {
    return TutorRequest.find({ _id: id })
      .populate("subjects")
      .populate("user")
      .populate("teacher");
  }

  getByUserId(id) {
    return TutorRequest.find({ user: id })
      .populate("subjects")
      .populate("user")
      .populate("teacher");
  }

  insertTutorRequest(tutoRequest) {
    return TutorRequest.insertMany([tutoRequest]);
  }

  findAndUpdateTutorRequest(filter, newData) {
    return TutorRequest.findOneAndUpdate(filter, newData, { new: true });
  }

  getByTeacherId(id) {
    return TutorRequest.find({
      teacher: id,
    })
      .populate("subjects")
      .populate("user")
      .populate("teacher");
  }

  deleteTutorRequest(id) {
    // TODO: implement;
  }
}

export default TutorRequestDataSource;
