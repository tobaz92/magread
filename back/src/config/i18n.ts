import i18n from "i18n";
import path from "path";

i18n.configure({
  locales: ["en", "fr"], // Langues prises en charge
  defaultLocale: "en", // Langue par défaut
  directory: path.join(__dirname, "../../locales"), // Chemin vers les fichiers de traduction
  cookie: "lang", // Utiliser le cookie 'lang' pour déterminer la langue
  queryParameter: "lang", // Paramètre de requête pour changer la langue
  autoReload: false, // Recharger automatiquement les fichiers modifiés
  syncFiles: true,
  objectNotation: true,
});

export default i18n;
