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
    process.exit(1);
  }
};
if (mongoose.connection.readyState !== 1) {
  connectDB();
}

export const db = mongoose.connection;
