// import UserModel from "../../models/users";
import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/users";
import { AuthenticatedRequest, HttpError } from "../../types/auth";

const userExist = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.userId;

    // check with userModel if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return next(
        Object.assign(new Error("User not found") as HttpError, {
          status: 400,
        })
      );
    }

    next();
  } catch (error: any) {
    return next(
      Object.assign(new Error(`Server error: ${error.message}`) as HttpError, {
        status: 500,
      })
    );
  }
};

export default userExist;
