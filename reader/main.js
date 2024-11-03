import "./style.css";

import React from "react";
import { createRoot } from "react-dom/client";
import Player from "./components/player";
import pako from "pako";
import { haveWebpVersion } from "./components/utils";

let started = false;

function decompressBase64Gzip(base64String) {
  const binaryString = atob(base64String);
  const binaryData = Uint8Array.from(binaryString, (char) =>
    char.charCodeAt(0)
  );

  const decompressedData = pako.ungzip(binaryData, { to: "string" });

  if (decompressedData.length > 1) {
    return JSON.parse(decompressedData);
  } else {
    return null;
  }
}

const getData = async (filename) => {
  const magreadConfig = window?.MagreadConfig || {};

  const path = `${magreadConfig.files}${filename}.d`;

  const response = await fetch(path);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du fichier JSON");
  }

  const data = await response.text();
  return data;
};

window.magReadInit = async () => {
  try {
    const dataBase64 = await getData("tempvars");
    const thumbnailBase64 = await getData("interfacelayout");

    const data = decompressBase64Gzip(dataBase64);
    const thumbnails = decompressBase64Gzip(thumbnailBase64);

    // window.MagreadConfig.havWebp = false;
    // const haveWebp = haveWebpVersion(data, (bool) => {
    //   window.MagreadConfig.havWebp = bool;
    // });

    if (data.length < 1) {
      throw new Error("Erreur lors de la récupération du fichier JSON");
    }

    const container = document.getElementById("magread");
    createRoot(container).render(
      <Player data={data} thumbnails={thumbnails} />
    );
  } catch (error) {
    console.error("Erreur:", error);
  }
};

if (!started) {
  started = true;
  window.magReadInit();
}
