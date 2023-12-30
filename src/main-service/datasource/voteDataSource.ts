import Vote from "../model/vote.model";

class VoteDataSource {
  getAll() {
    return Vote.find({});
  }
  insertVote(voteData) {
    return Vote.insertMany([voteData]);
  }
  updateVote(filter, newData) {
    return Vote.findOneAndUpdate(filter, newData, { new: true });
  }

  findVoteByTeacher(id) {
    return Vote.find({ userReceive: id }).populate("userSend");
  }

  findVoteByClassDone(id, idUser) {
    return Vote.findOne({ class: id, userSend: idUser }).populate("userSend");
  }

  findVoteByQuery(filter) {
    return Vote.find(filter).populate("userSend");
  }

  insertManyVote(data) {
    return Vote.insertMany(data);
  }
}

export default VoteDataSource;
