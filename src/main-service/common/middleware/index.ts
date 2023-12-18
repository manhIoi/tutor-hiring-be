import ERROR_CODE from "../../constant/errorCode";
import jwt from "jsonwebtoken";

export function verifyJWT(req, res, next) {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header.startsWith("Bearer "))
      return res.sendStatus(ERROR_CODE.UNAUTHORIZED);
    const token = header.split(" ")[1];
    jwt.verify(token, "key", (err, decoded) => {
      if (err) res.sendStatus(ERROR_CODE.FORBIDDEN);
      req.role = decoded?.role;
      next();
    });
  } catch (e) {
    return res.sendStatus(ERROR_CODE.UNAUTHORIZED);
  }
}

export function verifyRole(...roles) {
  return (req, res, next) => {
    if (!req?.role || !roles.includes(req.role))
      return res.sendStatus(ERROR_CODE.UNAUTHORIZED);
    next();
  };
}
