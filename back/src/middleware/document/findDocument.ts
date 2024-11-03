import { Response, NextFunction } from "express";
import { getDocument } from "../../controllers/documentController";

import { AuthenticatedRequest, HttpError, Document } from "../../types/auth";

const findDocument = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // if have public access in document
    const token = req.params.token || req.body.fileId;
    const document = (await getDocument(token)) as Document | null;

    if (!document)
      return next(
        Object.assign(new Error("Document not found") as HttpError, {
          status: 404,
        })
      );

    req.document = document;

    next();
  } catch (error: any) {
    return next(
      Object.assign(new Error(`Server error: ${error.message}`) as HttpError, {
        status: 500,
      })
    );
  }
};

export default findDocument;
