import { Request, Response } from "express";
import session from "express-session";
import { SessionData } from "express-session";
import {
  comparePassword,
  generateFingerprint,
  generateRandomPassword,
} from "../utils/globalUtils";

// Étendre l'interface Request pour inclure session
interface AuthenticatedRequest extends Request {
  session: session.Session & Partial<SessionData> & { userId?: string[] }; // Ajoute la propriété userId à la session
  user?: any; // Ajoute la propriété user à la requête
  settings?: any; // Ajoute la propriété settings à la requête
}
// Étendre l'interface Request pour inclure session
// interface AuthenticatedRequest extends Request {
//   session: session.Session & Partial<SessionData> & { userId?: string[] }; // Ajoute la propriété userId à la session
// }

import UserModel from "../models/users";
import { db } from "../db";
import { haveSession } from "../middleware/user/isConnectedBySession";
import emailService from "../emailService";

// Contrôleur pour obtenir tous les utilisateurs
export const getUsers = async (req: Request, res: Response) => {
  // FOR DEVELOPMENT PURPOSES ONLY
  try {
    const users = await UserModel.find();
    res.json({ users, session: req.session });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const signUpIndex = async (req: Request, res: Response) => {
  const isLoggedIn = await haveSession(req);
  if (isLoggedIn) {
    res.redirect("/");
    return;
  }

  res.render("auth/signup", {});
};
export const loginIndex = async (req: Request, res: Response) => {
  const isLoggedIn = await haveSession(req);
  if (isLoggedIn) {
    res.redirect("/");
    return;
  }

  const { email, password } = req.query;

  if (email && password) {
    req.body = { email, password, showMessages: false };

    try {
      await loginUser(req as AuthenticatedRequest, res);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
    return;
  } else {
    res.render("auth/login", {});
  }
};

export const meIndex = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  const settings = req.settings.length > 0 ? req.settings[0] : [];

  res.render("auth/me", {
    user,
    isLoggedIn: true,
    title: "Mon compte",
  });
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password } = req.body;

  // Ensure all fields are provided
  if (!username || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    // Create new user
    const createdUser = await UserModel.create({
      username,
      email,
      password,
      browserFingerprint: generateFingerprint(req),
    }).then(() => {
      loginUser(req as AuthenticatedRequest, res);
    });

    // use loginUser function to login user
  } catch (error: any) {
    // Return error response
    res
      .status(500)
      .json({ message: "--" + error.message || "Internal server error" });
    return;
  }
};

export const loginUser = async (req: AuthenticatedRequest, res: Response) => {
  const showMessages = req.body.showMessages;

  const isLoggedIn = await haveSession(req);
  if (isLoggedIn) {
    res.status(200).json({ message: "Utilisateur déjà connecté" });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email }).select(
      "username email role password"
    );

    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }
    const userPassword = user?.password;

    if (!userPassword) {
      res.status(401).json({ message: "Mot de passe incorrect" });
      return;
    }
    const isPasswordValid = await comparePassword(password, userPassword);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Mot de passe incorrect" });
      return;
    }

    // Vérification de l'existence d'une session
    if (!req.session) {
      res.status(500).json({ message: "Impossible de créer une session" });
      return;
    }

    // get all sessions by user
    const sessions = await db.collection("sessions").find().toArray();
    const sessionByUser = sessions.filter((session: any) => {
      const sessionData = JSON.parse(session.session);
      return sessionData.userId === user.id;
    });
    const sessionLength = sessionByUser.length;

    if (sessionLength > 3) {
      res.status(401).json({
        message:
          "Nombre de sessions maximum atteint, déconnez-vous des autres appareils",
      });
      return;
    }

    if (!req.session.userId) {
      req.session.userId = user.id;
    }
    if (showMessages) {
      res.status(201).json({ message: "Utilisateur connecté" });
    } else {
      if (process.env.NODE_ENV === "test") {
        res.status(302).json({ message: "Utilisateur connecté", user: user });
      } else {
        res.redirect("/");
      }
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req: AuthenticatedRequest, res: Response) => {
  // remove session in database
  const isLoggedIn = await haveSession(req);

  if ((req.session.userId, isLoggedIn)) {
    req.session.userId = [];
    // remove cookie connect.sid in browser
    res.clearCookie("connect.sid");

    //remove cookie in browser
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la déconnexion" });
      }
    });

    res.status(200).json({ message: "Utilisateur déconnecté" });
  }
};
export const forgotPasswordIndex = async (req: Request, res: Response) => {
  res.render("auth/forgot-password", {});
};
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }
    // generate random password with 24 characters
    const resetPassword = generateRandomPassword();

    user.password = resetPassword;

    const updatedUser = await user.save();

    await emailService.sendResetPasswordEmail(
      email,
      user.username,
      resetPassword
    );

    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    // send email to user
    res.status(200).json({ message: "Email envoyé" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forceLogoutUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const sessions = await db.collection("sessions").find().toArray();
  const sessionByUser = sessions.filter((session: any) => {
    const sessionData = JSON.parse(session.session);
    return sessionData.userId === id;
  });

  if (sessionByUser.length === 0) {
    res.status(404).json({ message: "Utilisateur non trouvé" });
    return;
  }
  sessionByUser.forEach(async (session: any) => {
    await db.collection("sessions").deleteOne({ _id: session._id });
  });

  res.status(200).json({ message: "Utilisateur déconnecté" });
};
