export const couvDer = (onFolio, maxFolio, data) => {
  if (onFolio === 0) {
    return "center";
  } else if (onFolio === maxFolio) {
    return "center";
  } else {
    if (onFolio % 2 === 0) {
      return "right";
    } else {
      return "left";
    }
  }
};

export const publicPath = (path) => {
  let realPath =
    process.env.NODE_ENV === "production"
      ? path.replace("/public/data", "/files")
      : path;

  if (process.env.NODE_ENV === "production") {
  }
  realPath = window.MagreadConfig.files + path.replace("./public/data/", "");

  return realPath;
};

export const haveWebpVersion = async (data, fn) => {
  if (data.length < 1) {
    return fn("No data");
  }
  fn(false)

};
