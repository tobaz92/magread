import React from "react";
import { publicPath } from "./utils";
const Fragement = ({ file, position, page }) => {
  let path = publicPath(`./public/data/${file}`).replace("..//", "./");

  if (window.MagreadConfig?.haveWebp) {
    path = path.replace(".jpg", ".webp");
  }

  const left = () => (position[0] * 100) / page.width;
  const top = () => (position[1] * 100) / page.height;
  const filename = file.split(".")[0];

  return (
    <img
      src={path}
      alt={filename}
      loading="lazy"
      style={{
        position: "absolute",
        left: `${left()}%`,
        top: `${top()}%`,
      }}
      decoding="async"
      importance="low"
    />
  );
};
export default Fragement;
