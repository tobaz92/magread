// import session from "express-session";
// import MongoStore from "connect-mongo";
// import { mongoURI } from "../../db";

// export const sessionMiddleware = session({
//   secret: `${process.env.SESSION_SECRET}`, // Utilise une clé secrète stockée dans une variable d'environnement pour la sécurité
//   resave: false, // Ne pas sauvegarder la session si elle n'a pas été modifiée
//   saveUninitialized: false, // Ne pas sauvegarder les sessions non initialisées
//   store: MongoStore.create({
//     mongoUrl: mongoURI,
//     collectionName: "sessions", // Nom de la collection où les sessions seront stockées
//     ttl: 14 * 24 * 60 * 60, // Durée de vie de la session en secondes (14 jours)
//   }),
//   cookie: {
//     secure: process.env.NODE_ENV === "production", // Le cookie est sécurisé seulement en production (HTTPS)
//     httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client pour plus de sécurité
//     sameSite: "lax", // Empêche les requêtes inter-sites non sécurisées
//     maxAge: 24 * 60 * 60 * 1000, // Durée de vie du cookie (1 jour)
//   },
// });

// export const closeSessionStore = async () => {
//   await MongoStore.create({
//     mongoUrl: mongoURI,
//     collectionName: "sessions",
//   }).client.close();
// }

import session from "express-session";
import MongoStore from "connect-mongo";
import { MongoClient } from "mongodb";
import { mongoURI } from "../../db";

// Créer une connexion manuelle à MongoDB
export const client = new MongoClient(mongoURI);

let mongoStore;

async function initializeSessionStore() {
  try {
    // Établir la connexion
    // await client.connect();
    // console.log("Connexion à MongoDB établie avec succès.");

    // Créer le store de sessions en utilisant le client existant
    mongoStore = MongoStore.create({
      client,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // Durée de vie de la session en secondes (14 jours)
    });
  } catch (error) {
    console.error("Erreur lors de la connexion à MongoDB :", error);
  }
}

// Initialiser le store de sessions
initializeSessionStore();

export const sessionMiddleware = session({
  secret: `${process.env.SESSION_SECRET}`, // Utilise une clé secrète stockée dans une variable d'environnement pour la sécurité
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // Durée de vie du cookie (1 jour)
  },
});


