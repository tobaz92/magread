import { Request, Response, NextFunction } from "express";

const notDirectFile = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const referer = req.headers.referer;
  if (!referer) {
    return next(
      Object.assign(
        new Error("Direct access to file is not allowed") as Error,
        {
          status: 404,
        }
      )
    );
  }

  next();
};

export default notDirectFile;
