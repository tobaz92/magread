import mongoose from "mongoose";

afterAll(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  } catch (error) {
    console.error("Error disconnecting mongoose:", error);
  }
});

// Ajouter un test vide pour éviter l'erreur
test("dummy test", () => {
  expect(true).toBe(true);
});
