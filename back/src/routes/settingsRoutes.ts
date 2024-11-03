import express from "express";
import isConnected from "../middleware/user/isConnectedBySession";
import {
  tokenGenerator,
  settingsIndex,
  updateSettings,
  connect,
} from "../controllers/settingsController";
import settingsData from "../middleware/setting/settingsMiddleware";
import decodeTokenEmbeded from "../middleware/setting/decodeTokenEmbeded";
import userExist from "../middleware/user/userExist";
import tokenExist from "../middleware/setting/tokenExist";
import domainExist from "../middleware/setting/domainExist";
import expiresAtValid from "../middleware/setting/expiresAtValid";
import findDocument from "../middleware/document/findDocument";
import isPublic from "../middleware/document/isPublic";
const settingsRouter = express.Router();

settingsRouter.get("/", isConnected, settingsData, settingsIndex);

settingsRouter.post("/", isConnected, settingsData, updateSettings);

settingsRouter.post("/tokengenerator", isConnected, tokenGenerator);

settingsRouter.post(
  "/connect",
  decodeTokenEmbeded,
  userExist,
  tokenExist,
  domainExist,
  expiresAtValid,
  findDocument,
  isPublic,
  connect
);

export default settingsRouter;
