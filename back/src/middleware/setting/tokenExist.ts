import { Request, Response, NextFunction } from "express";
import SettingsModel from "../../models/settings";
import { AuthenticatedRequest, HttpError } from "../../types/auth";

const tokenExist = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req?.token;
    const userId = req?.userId;

    const settings = await SettingsModel.find({ userId: userId });

    req.settings = settings;

    if (!settings) {
      return next(
        Object.assign(new Error("Settings data not found") as HttpError, {
          status: 404,
        })
      );
    }

    const embedTokens = settings[0]?.embedTokens;

    req.embedTokens = embedTokens;

    if (!embedTokens) {
      return next(
        Object.assign(new Error("Embed tokens not found") as HttpError, {
          status: 404,
        })
      );
    }

    const mathToken = embedTokens.find((embedToken: any) => {
      return embedToken.token === token;
    });
    if (!mathToken) {
      return next(
        Object.assign(new Error("Token not found") as HttpError, {
          status: 404,
        })
      );
    }

    req.embedToken = mathToken;

    next();
  } catch (error: any) {
    return next(
      Object.assign(new Error(`Server error: ${error.message}`) as HttpError, {
        status: 500,
      })
    );
  }
};

export default tokenExist;
