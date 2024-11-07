import { Request, Response } from "express";
import path from "path";
import { exec } from "child_process";
import { db } from "../db";
import { haveSession } from "../middleware/user/isConnectedBySession";
// import { get } from "mongoose";
import {
  decodeBase64,
  decodeGzipBase64,
  getAssetsEmbedUrl,
} from "../utils/globalUtils";
const fs = require("fs");

interface CustomRequest extends Request {
  document?: any;
}

export const documentIndex = async (req: Request, res: Response) => {
  const userId = req.session.userId ? req.session.userId : [];
  const isLoggedIn = userId.length > 0 ? true : false;
  if (!isLoggedIn) {
    res.status(404).render("guest/404", { isLoggedIn: false });
    return;
  }

  res.render("pages/upload", { isLoggedIn, userId });
};

// Fonction pour le téléchargement de fichiers
export const uploadFile = (
  req: Request & { file?: Express.Multer.File; user?: any },
  res: Response
): void => {
  if (!req.file) {
    res.status(400).send("Aucun fichier téléchargé.");
    return;
  }

  const userId = req.user ? req.user._id.toString() : null;

  const token = tokenGenerator();
  const document = {
    token: token,
    name: req.file.originalname,
    size: req.file.size,
    userId: userId,
    file: req.file.path,
    public: false,
  };

  const documentFolder = path.join(__dirname, "../../documents/", token);
  const filePath = path.join(__dirname, "../../", req.file.path);
  // create folder
  if (!fs.existsSync(documentFolder)) {
    fs.mkdirSync(documentFolder);
  }
  const command = `./bin/core/core -f ${filePath} -o ${documentFolder} -n 9999`;
  console.log("command", command);

  exec(command, (error: any, stdout: any, stderr: any) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }

    saveDocumentInCollectionDocuments(document);
    done(stdout);
    runOpti();
  });

  const runOpti = () => {
    const commandOpti = `./bin/optimizer/optimizer -f ${documentFolder} -webp`;
    console.log("commandOpti", commandOpti);

    exec(commandOpti, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }

      if (stderr) {
        console.error(`commandOpti stderr: ${stderr}`);
      }

      if (stdout) {
        console.log(`commandOpti stdout: ${stdout}`);
      }
    });
  };

  const done = (stdout: string) => {
    const elapsed = stdout;
    // const elapsedValue = JSON.parse(elapsed).elapsed;

    const url = `/document/view/${token}/`;
    const result = {
      token: token,
      url: url,
      // elapsed: elapsedValue,
      elapsed: "elapsedValue",
    };
    res.status(200).send(result);
  };

  const saveDocumentInCollectionDocuments = (document: Object) => {
    db.collection("documents")
      .insertOne(document)
      .then((result: any) => {})
      .catch((err: any) => {
        console.error("Erreur lors de la sauvegarde du document : ", err);
      });
  };
};

// Fonction pour afficher le fichier associé à un token
export const viewTokenFile = async (
  req: Request & { file?: Express.Multer.File; user?: any },
  res: Response
) => {
  const assets = getAssetsEmbedUrl();
  res.render("content/index", {
    assets,
    files: "./files/",
    url: "/assets/",
    server: "",
    webpReady: true,
  });
};

// Fonction pour récupérer un fichier associé à un token
export const getFileByToken = async (
  req: Request & { file?: Express.Multer.File; user?: any },
  res: Response
) => {
  const tokenPath = path.join(__dirname, "../../documents/", req.params.token);
  const file = req.params.file;
  const filePath = path.join(tokenPath, file);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Fichier introuvable.");
  }
};

// Fonction pour récupérer la liste des tokens et des fichiers associés
export const listTokens = (
  req: Request & { file?: Express.Multer.File; user?: any },
  res: Response
) => {
  const userId = req.user ? req.user._id.toString() : null;
  const documents = getDocuments(userId);
  res.send({ documents });
};

// Fonction pour gérer un fichier associé à un token
export const deleteDocument = async (
  req: Request & { file?: Express.Multer.File; user?: any },
  res: Response
) => {
  const userId = req.user ? req.user._id.toString() : null;

  const documentToken = req.params.token;

  const document = await db
    .collection("documents")
    .findOne({ token: documentToken, userId: userId });
  if (!document || document.userId !== userId) {
    res.status(403).send("Accès interdit. 3");
    return;
  }

  // remove file un uploads
  fs.unlinkSync(path.join(__dirname, "../../", document.file));

  // remove folder in tokens
  const tokenPath = path.join(__dirname, "../../documents/", document.token);
  fs.rm(tokenPath, { recursive: true }, (err: Error | null) => {
    if (err) {
      throw err;
    }
  });

  // delete document
  db.collection("documents").deleteOne({ token: documentToken });
  res.status(200).send("Document supprimé.");
};

export const updateDocument = async (
  req: Request & { file?: Express.Multer.File; user?: any; document?: any },
  res: Response
) => {
  db.collection("documents").updateOne(
    { token: req.params.token },
    { $set: req.body }
  );

  res.status(200).send("Document modifié.");
};

// Fonction pour générer un token unique
const tokenGenerator = () => {
  const token =
    Math.random().toString(36).substring(2, 15) +
    "-" +
    Math.random().toString(36).substring(2, 15) +
    "-" +
    Math.random().toString(36).substring(2, 15) +
    "-" +
    Math.random().toString(36).substring(2, 15);
  return token;
};

export const getDocuments = async (
  userId: string[],
  formated: boolean = false
) => {
  const documents = await db
    .collection("documents")
    .find({ userId: userId })
    .toArray();

  if (!formated) {
    return documents;
  } else {
    if (documents.length === 0) {
      return [];
    }

    const formattedDocuments = await Promise.all(
      documents.map(async (document: any) => {
        const thumbnailBase64 = fs.readFileSync(
          path.join(
            __dirname,
            "../../documents/",
            document.token,
            "interfacelayout.d"
          ),
          "utf-8"
        );
        const thumbnailFilenameJson = decodeGzipBase64(thumbnailBase64);
        const thumbnailFilename = thumbnailFilenameJson
          ? JSON.parse(thumbnailFilenameJson)[0][0][0].split("/")[4] || ""
          : "";

        return {
          title: document.name,
          token: document.token,
          url: `/document/view/${document.token}/`,
          thumbnailUri: `/document/view/${document.token}/files/${thumbnailFilename}`,
          public: document.public,
        };
      })
    );

    return formattedDocuments;
  }
};
export const getDocument = async (token: string) => {
  const document = await db.collection("documents").findOne({ token: token });
  return document;
};
