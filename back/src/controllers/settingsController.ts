import { Request, Response, RequestHandler } from "express";
import SettingsModel from "../models/settings";
import {
  decodeToken,
  generateToken,
  getAssetsEmbedUrl,
} from "../utils/globalUtils";
import { db } from "../db";
interface AuthenticatedRequest extends Request {
  id?: string;
  userId?: string;
  user?: { id: string };
  settings?: any[];
  token?: string;
  tokens?: any;
  document?: any;
}

export const settingsIndex = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req.user;

  const settings =
    req.settings && req.settings.length > 0 ? req.settings[0] : [];

  res.render("pages/settings", {
    user,
    isLoggedIn: true,
    settings,
    title: "Settings",
  });
};

export const updateSettings: RequestHandler = async (
  req: AuthenticatedRequest,
  res
) => {
  const userId = req.user?.id;
  const newSettings = req.body;

  try {
    await SettingsModel.findOneAndUpdate({ userId }, newSettings, {
      upsert: true,
      new: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal server error" });
    return;
  }
  res.status(200).send({ message: "Document settings updated" });
};

export const tokenGenerator: RequestHandler = async (
  req: AuthenticatedRequest,
  res
) => {
  const { domain, fileId, expiresAt } = req.body?.embedToken;
  const userId = req.user?.id;
  const tokens = generateToken(domain, fileId, expiresAt, userId);

  res.status(200).send({ domain, fileId, expiresAt, tokens });
};

export const connect: RequestHandler = async (
  req: AuthenticatedRequest,
  res
) => {
  const serverUrl = process.env.SERVER_URL || "http://localhost:3000";

  let result = { ...req.document };

  for (const key in req.document) {
    const value = req.document[key];

    if (key === "url") {
      result[key] = `${serverUrl}${value}`;
    } else if (key === "thumbnailUri") {
      result[key] = `${serverUrl}${value}`;
    } else {
      delete result[key];
    }
  }
  result["files"] = result.url + "files/";
  result["server"] = serverUrl;

  const assets = getAssetsEmbedUrl();
  result["assets"] = {
    script: `${serverUrl}/v1/${assets.script}`,
    style: `${serverUrl}/v1/${assets.style}`,
  };

  res.status(200).send(result);
};

export const deleteSettings: RequestHandler = async (
  req: AuthenticatedRequest,
  res
) => {
  const id = req.params;
  const settings = await db.collection("settings").find().toArray();



  const settingsByUser = settings.filter((setting: any) => {
    return setting.userId === id.id;
  });



  if (settingsByUser.length === 0) {
    res
      .status(404)
      .json({ message: "Document settings not found " });
    return;
  }

  settingsByUser.forEach(async (setting: any) => {
    await db.collection("settings").deleteOne({ _id: setting._id });
  });
  res.status(200).json({ message: "Document settings deleted" });

  // try {
  //   await SettingsModel.findOneAndDelete({ userId });
  // } catch (error: any) {
  //   res.status(500).json({ message: error.message || "Internal server error" });
  //   return;
  // }
  // res.status(200).send({ message: "Document settings deleted" });
};
