import ERROR_CODE from "../constant/errorCode";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  console.info("LOGGER:: req", req);
  const token = req.session.token;
  console.info("LOGGER:: token", token);
  if (!token) {
    return res.status(ERROR_CODE.FORBIDDEN).send({
      error: "No token provided!",
    });
  }
  const secret = "";
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(ERROR_CODE.UNAUTHORIZED).send({
        error: "Unauthorized!",
      });
    }
    console.info("LOGGER:: decoded", decoded);
    next();
  });
};

export const isTeacher = async () => {};

export const isAdmin = async () => {};
