import { Router } from "express";
import multer from "multer";
import path from "path";

import {
  uploadFile,
  viewTokenFile,
  getFileByToken,
  deleteDocument,
  documentIndex,
  updateDocument,
} from "../controllers/documentController";

import isConnected, {
  isConnectedBool,
} from "../middleware/user/isConnectedBySession";
import isPublic from "../middleware/document/isPublic";
import findDocument from "../middleware/document/findDocument";
import notDirectFile from "../middleware/document/notDirectFile";

const documentRouter = Router();

const storage = multer.diskStorage({
  destination: (
    req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "uploads/");
  },
  filename: (
    req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Routes

documentRouter.get("/", documentIndex);

documentRouter.post("/upload", upload.single("file"), isConnected, uploadFile);

documentRouter.get(
  "/view/:token",
  findDocument,
  isConnectedBool,
  isPublic,
  viewTokenFile
);

documentRouter.get(
  "/view/:token/files/:file",
  findDocument,
  isConnectedBool,
  isPublic,
  notDirectFile,
  getFileByToken,
);

documentRouter.delete("/:token", isConnected, deleteDocument);
documentRouter.patch("/:token", isConnected, findDocument, updateDocument);

export default documentRouter;
