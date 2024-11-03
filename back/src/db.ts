// import mongoose from "mongoose";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const mongoURI =
  `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}` ||
  "mongodb://localhost:27017/magread";

mongoose.connect(mongoURI).catch((err) => console.log(err));

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("An error occurred while connecting to the database: ", error);
  throw new Error("An error occurred while connecting to the database: ");
});
db.once("open", () => {
  console.log("Database connection successful");
});

export { db };
