import bcrypt from "bcrypt";

export const genPassword = async (password: string) => {
  const passwordHashed = await bcrypt.hash(password.toString(), 10);
  return passwordHashed;
};
export const comparePassword = async (password: string, hash: string) => {
  const isMatched = await bcrypt.compare(password, hash);
  return isMatched;
};
