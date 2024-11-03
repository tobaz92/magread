import UserModel from "../../models/users";
import { Request, Response, NextFunction } from "express";

import { AuthenticatedRequest, HttpError } from "../../types/auth";

const isAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findById(req.id);
    if (!user || user.role !== "admin") {
      return next(
        Object.assign(
          new Error(
            "You are not authorized to perform this action"
          ) as HttpError,
          {
            status: 403,
          }
        )
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

export default isAdmin;
