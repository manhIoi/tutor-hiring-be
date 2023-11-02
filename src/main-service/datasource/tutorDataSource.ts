import Tutor from "../model/tutor.model";

class TutorDataSource {
  getAllListTutor() {
    return Tutor.find({});
  }
  getSuggestTutor() {
    return Tutor.find({});
  }
}

export default new TutorDataSource();
