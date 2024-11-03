import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },

  // Domaines où les documents sont visibles
  allowedDomains: { type: [String], default: [] }, // Domaines autorisés pour l'ensemble des documents

  // Token pour l'embed
  embedTokens: [
    {
      token: { type: String, required: true }, // Token généré pour l'embed
      tokenBase64: { type: String, required: true }, // Token généré pour l'embed
      domain: { type: String, required: true }, // Domaine spécifique où le token est valide
      fileId: { type: String, required: false }, // Optionnel : fichier spécifique pour lequel le token est valide (sinon pour tous les documents)
      expiresAt: { type: Date, required: false }, // Optionnel : date d'expiration du token
    },
  ],

  // Limitation des documents visibles sur des domaines spécifiques
  domainFileVisibility: [
    {
      domain: { type: String, required: true }, // Domaine spécifique
      fileId: { type: String, required: true }, // Fichier spécifique visible uniquement sur ce domaine
    },
  ],
});

const SettingsModel = mongoose.model("settings", settingsSchema);
export default SettingsModel;
