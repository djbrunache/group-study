# Diagnostic de l'erreur "java.lang.String cannot be cast to java.lang.Boolean"

## Corrections appliquées

### 1. Suppression de tous les `Boolean()` wrappers
- ✅ `blurOnSubmit={false}` au lieu de `Boolean(false)`
- ✅ `disabled={isSigningOut}` au lieu de `Boolean(isSigningOut)`
- ✅ `disabled={!isMember}` au lieu de `Boolean(!isMember)`
- ✅ `disabled={isJoining}` au lieu de `Boolean(isJoining)`

### 2. Simplification des composants Link
- ✅ `asChild` au lieu de `asChild={true}`

### 3. Simplification du composant Switch
- ✅ Suppression de `trackColor` et `thumbColor` qui peuvent causer des problèmes

### 4. Correction de app.json
- ✅ Suppression de `newArchEnabled` (Expo Go l'active toujours)

## Comment identifier le composant exact qui cause l'erreur

### Étape 1 : Vérifier les logs Android
```bash
# Sur Windows PowerShell
adb logcat | Select-String -Pattern "String.*Boolean|Cannot cast"
```

### Étape 2 : Tester sans les composants Clerk
Temporairement, commentez les composants SignIn et SignUp pour voir si l'erreur persiste :

Dans `app/(auth)/sign-in.tsx` :
```tsx
export default function SignInScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={{ color: '#fff' }}>Sign In (temporairement désactivé)</Text>
        {/* <SignIn routing="path" ... /> */}
      </View>
    </SafeAreaView>
  );
}
```

### Étape 3 : Vérifier les versions des dépendances
Le problème pourrait venir d'une incompatibilité entre :
- React 19.1.0 (très récent)
- React Native 0.81.5
- Expo Router 6.0.14
- Clerk 2.19.2

### Étape 4 : Tester avec un build de développement
```bash
cd Group_Study_app
npx expo run:android --clear
```

## Solutions alternatives

### Solution 1 : Downgrader React
Si React 19 cause des problèmes, essayez React 18 :
```bash
npm install react@18.2.0 react-dom@18.2.0
```

### Solution 2 : Mettre à jour Clerk
```bash
npm update @clerk/clerk-expo
```

### Solution 3 : Vérifier si c'est un problème connu
Cherchez sur GitHub :
- https://github.com/clerk/clerk-react/issues
- https://github.com/expo/expo/issues
- https://github.com/react-navigation/react-navigation/issues

## Si l'erreur persiste

L'erreur pourrait venir :
1. **Des composants Clerk internes** - Contactez le support Clerk
2. **D'une incompatibilité React 19** - Downgrade vers React 18
3. **D'un problème avec Expo Router** - Vérifiez les issues GitHub
4. **D'un cache corrompu** - Nettoyez complètement :
   ```bash
   # Nettoyer le cache npm
   npm cache clean --force
   
   # Nettoyer le cache Expo
   npx expo start -c
   
   # Nettoyer le cache Android
   cd android
   ./gradlew clean
   cd ..
   npx expo run:android --clear
   ```


