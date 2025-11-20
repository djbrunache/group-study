# Configuration des variables d'environnement

Cette application utilise **Clerk** pour l'authentification et **Firebase Firestore** pour la base de données.

## 📋 Étapes de configuration

### 1. Créer un compte Clerk

1. Allez sur [clerk.com](https://clerk.com) et créez un compte
2. Créez une nouvelle application
3. Copiez votre **Publishable Key** depuis le dashboard Clerk

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet `Group_Study_app/` avec le contenu suivant :

```env
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_votre_clef_clerk_ici

# Firebase Firestore (Database only)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyAsHXl1t2zjGP6kXLbrGzvgQJoKtLq_SuM
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=group-study-app-d33dc.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=group-study-app-d33dc
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=group-study-app-d33dc.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=570279088517
EXPO_PUBLIC_FIREBASE_APP_ID=1:570279088517:web:fb306edaac04ed9b3db4ec
```

### 3. Important

- ⚠️ **Ne commitez JAMAIS** le fichier `.env` dans Git
- Le fichier `.env` est déjà dans `.gitignore`
- Utilisez `.env.example` comme modèle pour votre équipe

### 4. Redémarrer Expo

Après avoir créé/modifié le fichier `.env`, redémarrez Expo :

```bash
npx expo start -c
```

Le flag `-c` nettoie le cache pour charger les nouvelles variables d'environnement.

## 🔧 Structure de l'authentification

- **Clerk** : Gère toute l'authentification (connexion, inscription, gestion des sessions)
- **Firebase Firestore** : Stocke uniquement les données de l'application (groupes, événements, etc.)

## 📝 Notes

- Les variables d'environnement doivent commencer par `EXPO_PUBLIC_` pour être accessibles dans l'application
- Les variables sont également configurées dans `app.json` pour être disponibles via `expo-constants`



