// import mongoose from "mongoose";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const mongoURI = `${process.env.MONGO_URL}/${process.env.DATABASE_NAME}`;

mongoose.connect(mongoURI).catch((err) => console.log(err));

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("An error occurred while connecting to the database: ", error);
  throw new Error("An error occurred while connecting to the database: ");
});
db.once("open", () => {
  if (process.env.NODE_ENV !== "test") {
    console.log("Database connection successful");
  }
});

export { db };
