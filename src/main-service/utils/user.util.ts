export const getVoteValue = (voteList = []) => {
  const sum = voteList.reduce(
    (current, item, index) => current + item?.value,
    0,
  );
  return sum / voteList.length;
};
