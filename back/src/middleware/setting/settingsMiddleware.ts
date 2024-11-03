import DocumentSettingsModel from "../../models/settings";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, HttpError } from "../../types/auth";

const settingsData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const settings = (await DocumentSettingsModel.find({ userId })) || [];

    req.settings = settings;

    next();
  } catch (error: any) {
    return next(
      Object.assign(new Error(`Server error: ${error.message}`) as HttpError, {
        status: 500,
      })
    );
  }
};

export default settingsData;
