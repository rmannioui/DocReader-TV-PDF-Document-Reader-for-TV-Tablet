# DocReader TV — PDF & Document Reader for TV & Tablet

Application hybride moderne de lecture de documents PDF et manuels d'utilisation, spécialement conçue et optimisée pour **Android TV**, **Android TV Box**, **Smart TVs compatibles** et **Tablettes Android**, ainsi que pour tout navigateur web moderne.

---

## 📋 Table des matières

1. [Fonctionnalités principales](#-fonctionnalités-principales)
2. [Commandes Télécommande Android TV & Clavier](#-commandes-télécommande-android-tv--clavier)
3. [Structure du projet](#-structure-du-projet)
4. [Guide étape par étape : Création du dépôt GitHub](#-guide-étape-par-étape--création-du-dépôt-github)
5. [Activation de GitHub Pages & URL finale](#-activation-de-github-pages--url-finale)
6. [Empaquetage en APK pour Android TV & Tablette](#-empaquetage-en-apk-pour-android-tv--tablette)
7. [Distribution sur Amazon Appstore & Uptodown](#-distribution-sur-amazon-appstore--uptodown)
8. [Technologies & Sécurité](#-technologies--sécurité)

---

## 🌟 Fonctionnalités principales

- **Lecture de PDF & Manuels sans backend** : Rendu local 100% autonome via PDF.js, fonctionnant hors-ligne sans serveur, base de données ni abonnement.
- **Ergonomie 10-Foot UI (Grand écran TV)** : Interface conçue pour une lisibilité parfaite à 3 mètres de distance, avec des contrastes élevés, des boutons larges (min. 48-60px) et des marges sécurisées (TV Overscan safe-padding).
- **Navigation 100% Télécommande TV (D-Pad)** : Prise en charge intégrale des touches directionnelles (Haut, Bas, Gauche, Droite), du bouton OK et de la touche Retour. Chaque élément actif affiche un halo lumineux instantanément repérable.
- **Support des fichiers volumineux** : Rendu page par page avec buffer haute performance et accélération matérielle.
- **Reprise de lecture & Historique LocalStorage** : Mémorisation automatique des documents ouverts, de la dernière page lue, du niveau de zoom et des préférences utilisateur.
- **Confort visuel nocturne** : Modes d'affichage commutables d'une seule touche (Standard, Mode Nuit inversé pour écrans OLED/TV, Mode Sépia reposant, Contraste renforcé).
- **Adaptation tactile pour tablettes** : Support du tactile, du glissement horizontal pour tourner les pages et de la rotation portrait/paysage.
- **PWA & Hors-ligne** : Service Worker prêt à l'emploi et manifeste d'application web pour une installation instantanée sur tablette ou desktop.

---

## 🎮 Commandes Télécommande Android TV & Clavier

| Touche Télécommande / Clavier | Action |
| :--- | :--- |
| **Flèche Droite (►)** | Tourner la page (Page suivante) |
| **Flèche Gauche (◄)** | Page précédente |
| **Flèche Haut (▲) / Bas (▼)** | Défilement vertical du document ou déplacement dans l'interface |
| **Bouton OK / Touche Entrée** | Ouvrir un document, valider, ou masquer/afficher la barre d'outils |
| **Bouton Retour / Échap (Escape)** | Fermer le lecteur et revenir à l'écran d'accueil |
| **Touche +** | Zoom avant (+25%) |
| **Touche -** | Zoom arrière (-25%) |
| **Touche W** | Ajuster automatiquement la page à la largeur de l'écran |
| **Touche N ou D** | Basculer le filtre Mode Nuit / Inversion sombre |
| **Touche R** | Rotation de la page à 90° |
| **Touche M** | Ouvrir / Masquer le volet des miniatures de pages |
| **Touche F** | Basculer en mode Plein Écran (Fullscreen) |
| **Touche PageUp / PageDown** | Saut rapide de 5 pages |
| **Touche ? ou H** | Afficher l'aide des raccourcis à l'écran |

---

## 📁 Structure du projet

```text
docreader-tv/
│
├── index.html                  # Point d'entrée principal (Compatible GitHub Pages)
├── manifest.json               # Manifeste PWA pour installation
├── service-worker.js           # Cache hors-ligne pour tous les assets
├── css/
│   └── style.css               # Design sombre, 10-foot UI, animations et focus TV
├── js/
│   ├── app.js                  # Logique applicative, D-Pad engine, LocalStorage
│   ├── pdf.min.js              # Moteur PDF.js autonome (Offline)
│   └── pdf.worker.min.js       # Worker haute performance PDF.js
├── assets/
│   ├── guide-tv-tablet.pdf     # Manuel officiel préchargé
│   ├── manuel-raccourcis.pdf   # Guide des touches TV préchargé
│   ├── icons/                  # Icônes PWA et favicons (16, 32, 192, 512px)
│   └── images/                 # Bannières et illustrations
│
├── app/                        # Conteneur natif Android TV & Tablette (Prêt pour APK)
│   ├── src/main/AndroidManifest.xml
│   ├── src/main/java/com/example/MainActivity.kt
│   └── src/main/assets/        # Copie des fichiers web pour exécution native
└── README.md                   # Ce guide complet
```

---

## 🚀 Guide étape par étape : Création du dépôt GitHub

### Étape 1 : Initialiser le dépôt local
Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
git init
git add index.html manifest.json service-worker.js css/ js/ assets/ README.md
git commit -m "feat: initial commit DocReader TV for TV & Tablet"
```

### Étape 2 : Créer le dépôt sur GitHub
1. Connectez-vous sur [GitHub.com](https://github.com).
2. Cliquez sur le bouton **New repository** (Nouveau dépôt).
3. Nommez le dépôt (par exemple `pdf-tv-reader` ou `docreader-tv`).
4. Choisissez la visibilité **Public** (nécessaire pour GitHub Pages gratuit).
5. Ne cochez pas "Initialize this repository with a README" (vous l'avez déjà).
6. Cliquez sur **Create repository**.

### Étape 3 : Lier et envoyer vers GitHub
Exécutez dans votre terminal (remplacez `USERNAME` et `REPOSITORY` par vos identifiants) :

```bash
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git branch -M main
git push -u origin main
```

---

## 🌐 Activation de GitHub Pages & URL finale

### Étape 1 : Activer GitHub Pages dans les réglages
1. Rendez-vous sur votre dépôt GitHub : `https://github.com/USERNAME/REPOSITORY`.
2. Cliquez sur l'onglet **Settings** (Paramètres).
3. Dans le menu de gauche, descendez jusqu'à la section **Pages**.
4. Sous la rubrique **Build and deployment** :
   - **Source** : sélectionnez `Deploy from a branch`.
   - **Branch** : choisissez `main` et le dossier `/ (root)`.
5. Cliquez sur **Save**.

### Étape 2 : Accéder à l'application
GitHub génère le site statique sous 1 à 2 minutes.

- **URL de déploiement** :
  `https://USERNAME.github.io/REPOSITORY/`

- **Accès direct au fichier principal** :
  `https://USERNAME.github.io/REPOSITORY/index.html`

> 💡 *Remarque : Toutes les ressources (`css/`, `js/`, `assets/`) utilisent des chemins relatifs, ce qui garantit un fonctionnement immédiat et sans erreur 404 sur GitHub Pages.*

---

## 📦 Empaquetage en APK pour Android TV & Tablette

Ce projet offre **deux méthodes prêtes à l'emploi** pour générer un fichier APK installable sur Android TV, Fire TV, TV Box et tablettes :

### Méthode A : Utilisation directe du projet Android inclus (AI Studio / Gradle)
Le dossier `app/` contient déjà le code natif Kotlin (`MainActivity.kt`) et le manifest configuré pour Android TV (`LEANBACK_LAUNCHER`, bannière TV 16:9, permissions SAF pour stockage local).

1. Dans AI Studio ou Android Studio, ouvrez la racine du projet.
2. Lancez la génération de l'APK :
   ```bash
   gradle assembleRelease
   # ou pour tester directement :
   gradle assembleDebug
   ```
3. L'APK généré se trouvera dans `app/build/outputs/apk/release/app-release.apk` (ou `debug`).
4. Vous pouvez également cliquer sur **Export APK** dans les options de la plateforme AI Studio.

### Méthode B : Empaquetage avec Capacitor (Solution Hybride Web vers APK)
Si vous souhaitez empaqueter uniquement la partie web (`index.html`, `css/`, `js/`) :

1. Initialisez Capacitor dans le dossier :
   ```bash
   npm init -y
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "DocReader TV" "com.aistudio.pdfreader.tvboxq" --web-dir "."
   ```
2. Ajoutez la plateforme Android :
   ```bash
   npx cap add android
   npx cap copy
   ```
3. Ouvrez le projet dans Android Studio et compilez l'APK :
   ```bash
   npx cap open android
   ```

---

## 🏪 Distribution sur Amazon Appstore & Uptodown

L'application respecte l'ensemble des critères d'éligibilité pour les stores alternatifs :

### Amazon Appstore (Fire TV & Tablettes Fire)
- **Déclaration TV** : La bannière `tv_banner` (320x180) est incluse dans `res/drawable/tv_banner.png`.
- **Compatibilité Touchscreen** : La balise `<uses-feature android:name="android.hardware.touchscreen" android:required="false" />` est configurée pour que l'Amazon Appstore autorise le déploiement sur Fire TV Stick et Fire TV Cube sans écran tactile.
- **Navigation D-Pad** : Conforme au test de télécommande Amazon (DPAD Navigation Test).

### Uptodown
- **Zéro dépendance de Google Play Services** : L'application n'utilise pas de services Google propriétaires obligatoires et fonctionne parfaitement sur les appareils AOSP / sans services Google.
- **Stockage local** : Accès direct aux fichiers PDF locaux via le Storage Access Framework standard d'Android.
- **Vie privée** : Aucune collecte de données, aucun traceur publicitaire, 100% de respect de la vie privée de l'utilisateur.

---

## 🔒 Technologies & Sécurité

- **HTML5 & CSS3 natif** : Performances maximales sans framework lourd (aucun bundle JS complexe de plusieurs mégaoctets).
- **PDF.js v3.11** : Bibliothèque officielle et sécurisée pour le rendu PDF standard.
- **Zéro tracking & Zéro publicité** : Respect total du RGPD et des politiques de confidentialité.
- **Mode Hors-Ligne intégral** : Tous les scripts nécessaires (`pdf.min.js`, `pdf.worker.min.js`) sont fournis localement.
