# Utiliser une image Node.js officielle basée sur Debian Slim
FROM node:22.9.0-slim

# Installer les dépendances nécessaires, y compris pdftoppm
RUN apt-get update && apt-get install -y \
    poppler-utils && \
    rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail pour le projet Node.js
WORKDIR /app


# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json ./

# Installer les dépendances Node.js
RUN npm install

# Copier le reste du projet Node.js dans le conteneur
COPY . .

# Compiler le code TypeScript
RUN npm run build

# Exposer le port de l'application Express.js
EXPOSE 3000

# Commande pour démarrer l'application Node.js
CMD ["npm", "start"]