import React from "react";
import Fragement from "./fragment";
import { couvDer, publicPath } from "./utils";
const Page = ({ data, onFolio, maxFolio, thumbnail }) => {
  const page_data = data[0][1];
  const page_width = page_data[page_data.length - 2];
  const page_height = page_data[page_data.length - 1];

  // const thumbnail_url = publicPath(thumbnail.replace(/^.*[\\\/]/, "./files/")); // BEFORE
  let thumbnail_url = thumbnail.replace(
    /^.*[\\\/]/,
    window.MagreadConfig.files 
  );

  if (window.MagreadConfig?.haveWebp) {
    thumbnail_url = thumbnail_url.replace(".jpg", ".webp");
  }

  return (
    <div
      className={`player__pages__page`}
      data-folio={onFolio}
      data-type={couvDer(onFolio, maxFolio, data)}
      style={{
        width: page_width,
        height: page_height,
        backgroundImage: `url(${thumbnail_url})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      {data.map((fragment, index) => {
        const file = fragment[0];
        const position = fragment[1].slice(0, 2);
        // const size = fragment[1].slice(2, 4);

        return (
          <Fragement
            key={index}
            file={file}
            position={position}
            page={{ width: page_width, height: page_height }}
          />
        );
      })}
      {/* <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "0%",
          transform: "translate(-50%, 0%)",
          zIndex: 100,
          fontSize: "1.5rem",
          background: "rgb(255 255 255)",
          textAlign: "center",
          padding: "0.25rem 2rem",
          fontWeight: "bold",
        }}
      >
        {onFolio + 1}
      </div> */}
    </div>
  );
};
export default Page;
