import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, HttpError } from "../../types/auth";

const expiresAtValid = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const document = req.embedTokens?.[0] || {}; // Accéder au premier élément si embedTokens est un tableau.
    const expiresAt = document?.expiresAt || true;

    const now = new Date();
    const expiresAtDate = new Date(expiresAt);

    if (expiresAt !== true && expiresAtDate < now) {
      return next(
        Object.assign(new Error("ExpiresAt is expired") as HttpError, {
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

export default expiresAtValid;
