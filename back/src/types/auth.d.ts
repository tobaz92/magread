import { Request } from "express";

export interface HttpError extends Error {
  status?: number;
  message: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User | ObjectId;
  document?: Document;
  foundUser?: User;
  id?: string;
  _id?: string;
  userId?: string;
  token?: string;
  tokens?: any;
  settings?: any[];
  embedToken?: any;
  embedTokens?: any[];
}

export interface Document {
  arg0?: string;
  document?: { public?: boolean | undefined; userId?: string | undefined };
  _id?: string;
  userId?: string;
  title?: string;
  content?: string;
  public?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: string;
  id?: string;
  email?: string;
  password?: string;
  tokens?: any;
  settings?: any[];
  createdAt?: Date;
  updatedAt?: Date;

  username?: string;
  role?: "admin" | "editor";
  browserFingerprint?: string;
}
