// import { MongoClient } from "mongodb";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// dotenv.config();

// export const mongoURI = `${process.env.MONGO_URL}/${process.env.DATABASE_NAME}`;
// export const client = new MongoClient(mongoURI);
// export const db = client.db(process.env.DATABASE_NAME);

// client
//   .connect()
//   .then(() => {
//     console.log(`Connected to database ${process.env.DATABASE_NAME}`);
//   })
//   .catch((error) => {
//     console.error("Error connecting to database", error);
//     process.exit(1); // Arrête le processus si la connexion échoue
//   });

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/votre_nom_de_bdd");
//     console.log("MongoDB connecté");
//   } catch (err) {
//     console.error("Erreur de connexion à MongoDB", err);
//     process.exit(1); // Arrête le processus si la connexion échoue
//   }
// };

import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export const mongoURI = `${process.env.MONGO_URL}/${process.env.DATABASE_NAME}`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    if (process.env.NODE_ENV !== "test") {
      console.log(`Connecté à la base de données ${process.env.DATABASE_NAME}`);
    }
  } catch (err) {
    console.error("Erreur de connexion à MongoDB", err);
    process.exit(1); // Arrête le processus si la connexion échoue
  }
};
if (mongoose.connection.readyState !== 1) {
  connectDB();
}

export const db = mongoose.connection;
