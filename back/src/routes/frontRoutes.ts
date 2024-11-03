import express from "express";
import { haveSession } from "../middleware/user/isConnectedBySession";
import { getDocuments } from "../controllers/documentController";

declare module "express-session" {
  interface SessionData {
    userId: string[];
  }
}

const frontRouter = express.Router();

frontRouter.get("/", async (req, res) => {
  const isLoggedIn = await haveSession(req);
  const userId = isLoggedIn ? req.session.userId || [] : [];
  const documents = isLoggedIn ? await getDocuments(userId, true) : [];

  res.render("guest/home", {
    isLoggedIn,
    documents,
    title: res.__("Welcome to the homepage!"),
  });
});

export default frontRouter;
