import { Request, Response, NextFunction } from "express";
import { getDocument } from "../../controllers/documentController";

import { AuthenticatedRequest, HttpError } from "../../types/auth";

const isSameUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // if have public access in document
    const token = req.params.token;
    const document = await getDocument(token);

    if (!document) {
      return next(
        Object.assign(new Error("Document not found") as HttpError, {
          status: 404,
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

export default isSameUser;
