import { app } from "./app";
import { db } from "./db";

db.on("error", (error) => {
  console.error("An error occurred while connecting to the database: ", error);
  throw new Error("An error occurred while connecting to the database: ");
});

const PORT = process.env.API_PORT || 3000;


/* 

DATABASE_USER
DATABASE_PASSWORD
DATABASE_NAME
DATABASE_HOST
DATABASE_PORT
SESSION_SECRET
TOKEN_SECRET

*/

console.log("DATABASE_USER", process.env.DATABASE_USER);
console.log("DATABASE_PASSWORD", process.env.DATABASE_PASSWORD);
console.log("DATABASE_NAME", process.env.DATABASE_NAME);
console.log("DATABASE_HOST", process.env.DATABASE_HOST);
console.log("DATABASE_PORT", process.env.DATABASE_PORT);
console.log("SESSION_SECRET", process.env.SESSION_SECRET);
console.log("TOKEN_SECRET", process.env.TOKEN_SECRET);



app.listen(PORT, () => {
  console.log("");
  console.log("\x1b[36m%s\x1b[0m", `http://localhost:${PORT}`);
  console.log("");
});
