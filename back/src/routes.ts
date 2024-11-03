import { Router } from "express";
import documentRouter from "./routes/documentRoutes";
import userRouter from "./routes/userRoutes";
import frontRouter from "./routes/frontRoutes";
import pagesRouter from "./routes/pagesRoutes";
import settingsRouter from "./routes/settingsRoutes";
import { getLocale } from "i18n";

const router = Router();

router.post("/lang/:locale", (req, res, next) => {
  const locale = req.params.locale
    .trim()
    .substring(0, 2)
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  if (["en", "fr"].includes(locale)) {
    res.cookie("lang", locale);
    req.setLocale(locale);
    req.locale = locale;
  }

  // res.json({ message: "OK" });
  // statut 200 message ok
  res.status(200).json({ message: `Language changed for:${locale}` });
});

router.use((req, res, next) => {
  if (
    req.cookies.lang &&
    ["en", "fr"].includes(req.cookies.lang) &&
    req.cookies.lang !== req.getLocale()
  ) {
    req.setLocale(req.cookies.lang);
    req.locale = req.cookies.lang;
  }

  next();
});

router.use("/", frontRouter);
router.use("/page", pagesRouter);
router.use("/", userRouter);
router.use("/document", documentRouter);
router.use("/settings", settingsRouter);

export { router };
