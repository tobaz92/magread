# Étape 1: Compiler le binaire Rust
FROM rust:latest AS builder

# Installer les dépendances nécessaires pour compiler le projet Rust avec mozjpeg-sys
RUN apt-get update && apt-get install -y nasm libjpeg-dev pkg-config && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail pour le projet Rust
WORKDIR /app

# Copier les fichiers Cargo.toml et Cargo.lock
COPY Cargo.toml ./

# Copier le reste du projet Rust dans le conteneur
COPY . .

# Compiler le projet en mode release
RUN cargo build --release

# Étape 2: Créer une image minimale pour exécuter le binaire
FROM debian:bullseye-slim

# Installer les bibliothèques nécessaires à l'exécution
RUN apt-get update && apt-get install -y libjpeg62-turbo && rm -rf /var/lib/apt/lists/*

# Copier le binaire compilé depuis l'étape de construction
COPY --from=builder /app/target/release/core /usr/local/bin/core