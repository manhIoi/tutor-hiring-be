import { ERolePermission } from "../../../common/model/User";

export function can(permission: ERolePermission) {
  return (req, res, next) => {
    // const userRole = req.user.role;
    // if (roles[userRole] && roles[userRole].can.includes(permission)) {
    //   next();
    // } else {
    //   res.status(403).send("Forbidden");
    // }
  };
}
