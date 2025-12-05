# 🌙 Projet Nuit de l'Info 2025 - Équipe 404 Sleep Not Found

Bienvenue sur le dépôt de notre application développée dans le cadre de **La Nuit de l'Info 2025**. Ce projet est une expérience narrative interactive mêlant visual novel, esthétique rétro et mini-jeux.

## 👥 L'Équipe : 404 Sleep Not Found

Ce projet a été réalisé avec passion (et caféine) par :

*   **Léo Condat**
*   **Léo Tuaillon**
*   **Jimmy Legg**

---

## 🎮 Fonctionnalités Principales

Notre application propose une immersion narrative unique grâce à plusieurs fonctionnalités clés :

### 📖 Moteur Narratif Interactif
*   **Système de Dialogue Avancé** : Une interface de dialogue inspirée des RPG classiques et Visual Novels.
*   **Synchronisation Audio/Texte** : Le défilement du texte est dynamiquement synchronisé avec les fichiers audio (voix off) pour une immersion totale. Le moteur calcule la vitesse d'affichage idéale en fonction de la durée de l'audio.
*   **Choix Multiples** : Le joueur influence le déroulement de l'histoire à travers des arbres de choix.

### 🕹️ Mini-Jeux Intégrés
*   **Space Invaders** : Un hommage aux classiques de l'arcade.
    *   Intégré directement dans la narration (le joueur doit gagner pour progresser).
    *   Système de vagues, score, vies et difficulté progressive.
    *   Effets visuels rétro (CRT scanlines).

### 🎨 Direction Artistique & UI
*   **Esthétique Rétro** : Utilisation de polices pixel-art (VT323) et d'interfaces stylisées 8-bit.
*   **Compagnon Virtuel ("Chatrlatant")** : Un personnage animé qui accompagne le joueur, avec ses propres dialogues et réactions.
*   **Curseur Personnalisé** : Pour renforcer l'immersion dans l'univers du jeu.

### ⚡ Performance & Technique
*   **Optimisation Audio** : Chargement asynchrone des assets audio pour éviter tout blocage du thread principal (lag) lors du déclenchement des dialogues.
*   **Stack Technique** : Développé avec **Next.js**, **React**, **Tailwind CSS** et **TypeScript**.

---

## 🚀 Installation et Lancement

Pour tester le projet localement :

1.  **Cloner le dépôt** :
    ```bash
    git clone https://github.com/leocdt/nuitInfo2025
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Lancer le serveur de développement** :
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

4.  Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🛠️ Technologies Utilisées

*   **Framework** : Next.js 14+ (App Router)
*   **Langage** : TypeScript
*   **Styles** : Tailwind CSS
*   **Polices** : Google Fonts (VT323, Irish Grover)
*   **Audio** : Web Audio API natif

---

*Projet réalisé durant la Nuit de l'Info 2025.*
