import { Request, Response, NextFunction } from "express";
import { db } from "../../db";
import UserModel from "../../models/users";

import { AuthenticatedRequest, HttpError } from "../../types/auth";

const isConnected = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isConnectedBySession = await haveSession(req);

    if (!isConnectedBySession) {
      res.redirect("/login");
      return;
    }

    const userId = req.session.userId;
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return next(
        Object.assign(new Error("User not found") as HttpError, {
          status: 500,
        })
      );
    }
    req.user = foundUser;

    next();
  } catch (error: any) {
    return next(
      Object.assign(new Error(`Server error: ${error.message}`) as HttpError, {
        status: 500,
      })
    );
  }
};
export const isConnectedBool = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isConnectedBySession = await haveSession(req);
    if (!isConnectedBySession) {
      req.user = null;
    }

    const userId = req.session.userId;
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      req.user = null;
    }
    req.user = foundUser;

    next();
  } catch (error: any) {
    return next(
      Object.assign(new Error(`Server error: ${error.message}`) as HttpError, {
        status: 500,
      })
    );
  }
};

export default isConnected;

export const haveSession = async (req: AuthenticatedRequest) => {
  const sessionID = req.sessionID.toString();

  if (!sessionID) {
    return false;
  }

  if (sessionID) {
    const sessionsData = await db.collection("sessions").find().toArray();
    const session = sessionsData.find(
      (session) => session._id.toString() === sessionID
    );
    if (!session) {
      return false;
    }

    const userId = JSON.parse(session?.session).userId;
    if (!userId) {
      await db.collection("sessions").deleteOne({ id: sessionID });
    } else {
      return true;
    }
  }
  return true;
};
