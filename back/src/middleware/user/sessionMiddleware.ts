import session from "express-session";
import MongoStore from "connect-mongo";
import { mongoURI } from "../../db";

// import dotenv from "dotenv";
// dotenv.config();


const sessionMiddleware = session({
  secret: `${process.env.SESSION_SECRET}`, // Utilise une clé secrète stockée dans une variable d'environnement pour la sécurité
  resave: false, // Ne pas sauvegarder la session si elle n'a pas été modifiée
  saveUninitialized: false, // Ne pas sauvegarder les sessions non initialisées
  store: MongoStore.create({
    mongoUrl: mongoURI,
    collectionName: "sessions", // Nom de la collection où les sessions seront stockées
    ttl: 14 * 24 * 60 * 60, // Durée de vie de la session en secondes (14 jours)
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production", // Le cookie est sécurisé seulement en production (HTTPS)
    httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client pour plus de sécurité
    sameSite: "lax", // Empêche les requêtes inter-sites non sécurisées
    maxAge: 24 * 60 * 60 * 1000, // Durée de vie du cookie (1 jour)
  },
});

export default sessionMiddleware;
