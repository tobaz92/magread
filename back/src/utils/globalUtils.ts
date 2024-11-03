import bcrypt from "bcryptjs";
import pako from "pako";

export const decodeBase64 = (base64String: string) => {
  const buffer = Buffer.from(base64String, "base64");
  return buffer.toString("utf-8");
};

export function decodeGzipBase64(base64String: string) {
  const binaryString = atob(base64String);
  const binaryData = Uint8Array.from(binaryString, (char) =>
    char.charCodeAt(0)
  );

  const decompressedData = pako.ungzip(binaryData, { to: "string" });

  if (decompressedData.length > 1) {
    return decompressedData;
  } else {
    return null;
  }
}

export const encodeBase64 = (string: string) => {
  const buffer = Buffer.from(string, "utf-8");
  return buffer.toString("base64");
};

export async function comparePassword(passworda: string, passwordb: string) {
  return await bcrypt.compare(passworda, passwordb);
}

export const generateRandomPassword = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0; i < 32; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
};

const crypto = require("crypto");

export function generateFingerprint(req: any) {
  const ip = req.ip; // Adresse IP de l'utilisateur
  const userAgent = req.headers["user-agent"]; // User-Agent
  const acceptLanguage = req.headers["accept-language"]; // Langue du navigateur
  const screenResolution = req.body.screenResolution; // Résolution d'écran (envoyée par le client)

  // Combinaison des données en une seule chaîne
  const fingerprintData = `${ip}-${userAgent}-${acceptLanguage}-${screenResolution}`;

  // Hachage des données pour obtenir une empreinte unique
  // const fingerprintHash = crypto
  //   .createHash("sha256")
  //   .update(fingerprintData)
  //   .digest("hex");

  // return fingerprintHash;
  return fingerprintData;
}

export function generateToken(
  domain: string,
  fileId: string,
  expiresAt: string,
  userId: string = ""
) {
  const tokenSecret = process.env.TOKEN_SECRET;

  let token = crypto
    .createHash("sha256")
    .update(`${domain}-${fileId}-${expiresAt}-${tokenSecret}`)
    .digest("hex");

  return {
    token: token,
    tokenBase64: encodeBase64(`${token}-${userId}`),
  };
}

export function decodeToken(token: string) {
  const decodedToken = decodeBase64(token);

  if (decodeBase64(token).split("-").length > 1) {
    const [token, userId] = decodedToken.split("-");
    return {
      newToken: token,
      userId,
    };
  }
}
const path = require("path");
import fs from "fs";
export function getAssetsEmbedUrl() {
  const pathPublic = path.join(__dirname, "../public/v1/assets");

  const files = fs.readdirSync(pathPublic);
  const scriptFile = files.find((file) => file.endsWith(".js"));
  const styleFile = files.find((file) => file.endsWith(".css"));

  console.log({
    script: scriptFile,
    style: styleFile,
  })

  return {
    script: scriptFile,
    style: styleFile,
  };
}
