import express from "express";
import { isConnectedBool } from "../middleware/user/isConnectedBySession";
const pagesRouter = express.Router();

import fs from "fs";
import path from "path";

pagesRouter.get("/:slug", isConnectedBool, async (req, res) => {
  const { slug } = req.params;

  const allPages = fs.readdirSync(path.join(__dirname, "../views/guest"));
  if (!allPages.includes(`${slug}.ejs`)) {
    return res
      .status(404)
      .render("guest/404", { isLoggedIn: req.session.userId });
  } else {
    res.render(`guest/${slug}`, { isLoggedIn: req.session.userId });
  }
});

export default pagesRouter;
