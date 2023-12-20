import Vote from "../model/vote.model";

class VoteDataSource {
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
}

export default VoteDataSource;
