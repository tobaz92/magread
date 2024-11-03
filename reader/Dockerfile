# Étape de construction de l'application Node.js
FROM node:22.9.0-slim AS builder

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail pour la construction
WORKDIR /app

# Copier et installer les dépendances Node.js
COPY package.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet Node.js
COPY . .

# Construire l'application pour générer les fichiers dans le dossier dist
RUN npm run build