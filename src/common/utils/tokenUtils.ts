import jwt, { SignOptions } from "jsonwebtoken";

function generateToken(
  payload: string | Buffer | object,
  options: SignOptions,
) {
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}
