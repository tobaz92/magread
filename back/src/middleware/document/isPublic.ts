import { Request, Response, NextFunction } from "express";

import { AuthenticatedRequest, HttpError } from "../../types/auth";

const isPublic = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.document && req.document.public) {
      next();
    } else {
      if (!req.user) {
        return next(
          Object.assign(new Error("Document is not public") as HttpError, {
            status: 404,
          })
        );
      }

      if (
        req.document &&
        req.user &&
        req.user._id &&
        req.user._id.toString() === req.document.userId
      ) {
        next();
      }
    }
  } catch (error: any) {
    return next(
      Object.assign(new Error(`Server error: ${error.message}`) as HttpError, {
        status: 500,
      })
    );
  }
};

export default isPublic;
