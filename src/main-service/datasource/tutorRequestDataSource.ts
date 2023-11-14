import TutorRequest from "../model/tutor-request.model";

class TutorRequestDataSource {
  getAll() {
    return TutorRequest.find({})
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

  deleteTutorRequest(id) {
    // TODO: implement;
  }
}

export default TutorRequestDataSource;
