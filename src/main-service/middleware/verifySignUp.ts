import UserModel from "../model/user.model";
import ERROR_CODE from "../constant/errorCode";

export const checkDuplicateAccount = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ phone: req.body.phone });
    if (user) {
      return res.status(ERROR_CODE.BAD_REQUEST).send({
        error: "Failed! Username is already in use!",
      });
    }
    next();
  } catch (e) {
    return res.status(ERROR_CODE.INTERNAL_SERVER_ERROR).send({
      message: "Unable to validate check validate account!",
    });
  }
};
