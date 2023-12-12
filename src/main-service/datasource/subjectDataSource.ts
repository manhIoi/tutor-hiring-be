import Subject from "../model/subject.model";

class SubjectDataSource {
  getAll() {
    return Subject.find({});
  }

  insertSubject(subject) {
    return Subject.insertMany([subject]);
  }

  deleteSubject(id) {
    // TODO: implement;
    // return Subject.insertMany([subject]);
  }
}

export default SubjectDataSource;
