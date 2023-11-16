import Vote from "../model/vote.model";

class VoteDataSource {
  insertVote(voteData) {
    return Vote.insertMany([voteData]);
  }
  updateVote(filter, newData) {
    return Vote.findOneAndUpdate(filter, newData, { new: true });
  }
}

export default VoteDataSource;
