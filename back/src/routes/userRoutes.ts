import express, { Request, Response } from "express";
const userRouter = express.Router();

import {
  createUser,
  loginUser,
  signUpIndex,
  loginIndex,
  logoutUser,
  forgotPasswordIndex,
  forgotPassword,
  meIndex,
} from "../controllers/usersControllers";
import isConnected from "../middleware/user/isConnectedBySession";
import documentSettingsData from "../middleware/setting/settingsMiddleware";

userRouter.get("/login", loginIndex);

userRouter.get("/sign-up", signUpIndex);

userRouter.get("/forgot-password", forgotPasswordIndex);

userRouter.get("/me", isConnected, documentSettingsData, meIndex);

userRouter.post("/users", createUser);

userRouter.post("/auth/login", loginUser);

userRouter.post("/auth/logout", logoutUser);

userRouter.post("/auth/forgot-password", forgotPassword);

export default userRouter;
