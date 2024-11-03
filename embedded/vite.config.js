import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    lib: {
      entry: "main.js", // chemin vers ton fichier d'entrée principal
      name: "MagRead", // Nom de ta bibliothèque globale
      fileName: "magread", // Nom du fichier de sortie
      formats: ["iife"], // Utiliser le format iife pour éviter les modules
    },
  },
});
