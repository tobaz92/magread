import { app } from "./app";


// db.on("error", (error) => {
//   console.error("An error occurred while connecting to the database: ", error);
//   throw new Error("An error occurred while connecting to the database: ");
// });

const PORT = process.env.API_PORT || 3000;

app.listen(PORT, () => {
  console.log("");
  console.log("\x1b[36m%s\x1b[0m", `http://localhost:${PORT}`);
  console.log("");
});