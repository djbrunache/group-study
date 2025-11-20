# Fix pour l'erreur "Cannot read property 'S' of undefined" dans ReactFabric

## Problème
L'erreur se produit dans ReactFabric-dev.js, ce qui indique un problème avec la nouvelle architecture React Native (Fabric) ou un cache corrompu.

## Solutions appliquées

### 1. ✅ Suppression de App.tsx
Le fichier `App.tsx` a été supprimé car Expo Router utilise `app/_layout.tsx` comme point d'entrée et n'a pas besoin de `App.tsx`.

### 2. ✅ Correction des versions React
- React 19.1.0 (requis par React Native 0.81.5)
- @types/react 19.1.0

## Étapes pour résoudre l'erreur

### Étape 1 : Nettoyer complètement le cache
```bash
cd Group_Study_app

# Nettoyer le cache npm
npm cache clean --force

# Nettoyer le cache Metro/Expo
npx expo start -c
```

### Étape 2 : Supprimer node_modules et réinstaller
```bash
cd Group_Study_app

# Supprimer node_modules
Remove-Item -Recurse -Force node_modules

# Supprimer package-lock.json
Remove-Item package-lock.json

# Réinstaller
npm install --legacy-peer-deps
```

### Étape 3 : Nettoyer le cache Android (si vous utilisez un build natif)
```bash
cd Group_Study_app

# Si vous avez un dossier android
if (Test-Path android) {
    cd android
    ./gradlew clean
    cd ..
}

# Rebuild
npx expo run:android --clear
```

### Étape 4 : Redémarrer Expo avec cache propre
```bash
npx expo start -c
```

## Si l'erreur persiste

### Solution alternative : Désactiver temporairement la nouvelle architecture
Ajoutez dans `app.json` :
```json
{
  "expo": {
    "newArchEnabled": false
  }
}
```

**Note** : Expo Go active toujours la nouvelle architecture, donc cette option ne fonctionne que pour les builds de développement/production.

### Vérifier les logs détaillés
```bash
# Activer les logs détaillés
npx expo start --dev-client
```

## Cause probable
L'erreur est probablement due à :
1. Un cache corrompu après les changements de versions React
2. Un conflit entre les versions de dépendances
3. Un problème avec la nouvelle architecture React Native dans Expo Go

La solution la plus probable est de nettoyer complètement le cache et de redémarrer.


