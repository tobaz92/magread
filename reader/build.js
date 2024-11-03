let distFolderName = readViteConfig();

function readViteConfig() {
  const fs = require("fs");
  const path = require("path");

  const configPath = path.resolve(__dirname, "vite.config.js");
  const content = fs.readFileSync(configPath, "utf8");

  // get value of outDir
  const outDirMatch = content.match(/outDir: "([^"]+)"/);
  const outDir = outDirMatch[1];

  return outDir;
}

function copyIndexHtml(distFolderName) {
  const fs = require("fs");
  const path = require("path");
  const distFolder = path.resolve(__dirname, distFolderName);
  const files = fs.readdirSync(distFolder);

  files.forEach((file) => {
    const ext = path.extname(file);
    if (ext === ".html") {
      const filePath = path.resolve(distFolder, file);
      const content = fs.readFileSync(filePath, "utf8");

      let newContent = content.replace(
        /<script type="module" crossorigin/g,
        "<script async"
      );

      newContent = newContent.replace(
        /<link rel="stylesheet" crossorigin /g,
        `<link rel="stylesheet" `
      );

      newContent = newContent.replace(/\.\/assets\//g, `/v1/`);

      fs.writeFileSync(filePath, newContent);
      console.log("index.html updated");

      const outputFolder = path.resolve(
        __dirname,
        "../../back/src/views/content"
      );

      const outputFilePath = path.resolve(outputFolder, file);
      fs.copyFileSync(filePath, outputFilePath);

      console.log("index.html copied to views folder");
    }
  });
}

function copyOutputAssets(distFolderName) {
  const fs = require("fs");
  const path = require("path");
  const distFolder = path.resolve(__dirname, distFolderName + "/assets");
  const files = fs.readdirSync(distFolder);
  const outputFolder = path.resolve(__dirname, "../../back/src/public/v1");

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  files.forEach((file) => {
    const filePath = path.resolve(distFolder, file);
    const outputFilePath = path.resolve(outputFolder, file);
    fs.copyFileSync(filePath, outputFilePath);
  });

  console.log("Assets copied to public folder");

  // copier le dossier image dans dist

  const imageFolder = path.resolve(__dirname, distFolderName + "/img");
  const outputImageFolder = path.resolve(
    __dirname,
    "../../back/src/public/v1/img"
  );

  if (!fs.existsSync(outputImageFolder)) {
    fs.mkdirSync(outputImageFolder);
  }

  const imageFiles = fs.readdirSync(imageFolder);
  imageFiles.forEach((file) => {
    const filePath = path.resolve(imageFolder, file);
    const outputFilePath = path.resolve(outputImageFolder, file);
    fs.copyFileSync(filePath, outputFilePath);
  });

  console.log("Images copied to public folder");

  fs.rm(
    path.resolve(__dirname, distFolder),
    { recursive: true, force: true },
    (err) => {
      if (err) {
        console.error("Error while removing output folder", err);
        return;
      }
    }
  );
  console.log("Output folder removed");
}
readViteConfig();
// copyIndexHtml(distFolderName);
removePublicFiles();

copyOutputAssets(distFolderName);

function removePublicFiles() {
  const fs = require("fs");
  const path = require("path");

  const publicFolder = path.resolve(__dirname, "../../back/src/public/v1");

  // remove all files and folders in publicFolder
  const files = fs.readdirSync(publicFolder);
  files.forEach((file) => {
    const filePath = path.resolve(publicFolder, file);
    fs.rmSync(filePath, { recursive: true, force: true });
  });
}
