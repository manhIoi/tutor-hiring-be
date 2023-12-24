import UserModel from "../model/user.model";
import ERROR_CODE from "../constant/errorCode";

export const checkDuplicateAccount = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ phone: req.body.phone });
    if (user) {
      return res.send({
        error: "Tài khoản đã có người sử dụng",
      });
    }
    next();
  } catch (e) {
    return res.send({
      message: "Không thể validate tài khoản",
    });
  }
};
