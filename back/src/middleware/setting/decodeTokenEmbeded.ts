// import UserModel from "../../models/users";
import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../../utils/globalUtils";

import { AuthenticatedRequest, HttpError } from "../../types/auth";

const decodeTokenEmbeded = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { domain, token } = req.body;
    if (!domain || !token) {
      return next(
        Object.assign(new Error("Missing domain or token") as HttpError, {
          status: 400,
        })
      );
    }

    const decodedToken = decodeToken(token);
    if (decodedToken) {
      const { userId, newToken } = decodedToken;
      req.userId = userId;
      req.token = newToken;
    } else {
      return next(
        Object.assign(new Error("Invalid token") as HttpError, {
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

export default decodeTokenEmbeded;
