import express from "express";
import i18n from "./config/i18n";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
const logger = require("./utils/logger");
const expressWinston = require("express-winston");

import { router } from "./routes";
import {sessionMiddleware} from "./middleware/user/sessionMiddleware";
import { errorMiddleware } from "./middleware/errorMiddleware";
import cookieParser from "cookie-parser";
import compression from "compression";

import helmet from "helmet";

const app = express();

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       "script-src": ["'self'"],  //       "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
//     },
//   })
// ); // A REMETTRE

app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(sessionMiddleware);

app.use(cookieParser()); // Middleware pour lire les cookies
app.use(i18n.init); // Middleware i18n avant les routes

// Middleware pour injecter i18n et __ dans les vues
app.use((req, res, next) => {
  res.locals.__ = res.__;
  res.locals.i18n = { getLocale: () => req.getLocale() };
  next();
});
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true, // Inclure les métadonnées comme le statusCode, IP, etc.
    msg: "HTTP {{req.method}} {{req.url}}", // Message custom pour les logs HTTP
    expressFormat: true, // Format style Apache
    colorize: false,
  })
);
app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);

app.use(errorMiddleware);

app.use((req: Request, res: Response, next: NextFunction) => {
  return res
    .status(404)
    .render("guest/404", { isLoggedIn: req.session.userId });
});





export { app };

