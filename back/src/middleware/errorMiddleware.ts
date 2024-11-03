import { Request, Response, NextFunction } from "express";

interface HttpError extends Error {
  status?: number;
}

export const errorMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[ERROR] ${err.message}`);
  const status = err.status || 500;
  console.log("status", status);

  if (req.method === "GET") {
    res.render(`guest/error`, { error: err.status, message: err.message });
  } else {
    res.status(status).json({
      success: false,
      status,
      message: err.message || "An unknown error occurred",
    });
  }
};
