// src/services/firebase.ts
// ✅ Configuration Firebase compatible avec Expo + React Native

import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚠️ Remplace ces valeurs par celles de ton projet Firebase :
const firebaseConfig = {
  apiKey: "AIzaSyAsHXl1t2zjGP6kXLbrGzvgQJoKtLq_SuM",
  authDomain: "group-study-app-d33dc.firebaseapp.com",
  projectId: "group-study-app-d33dc",
  storageBucket: "group-study-app-d33dc.appspot.com", // ⚠️ corrigé ici (".firebasestorage.app" → ".appspot.com")
  messagingSenderId: "570279088517",
  appId: "1:570279088517:web:fb306edaac04ed9b3db4ec",
  measurementId: "G-9555Z67H2X",
};

// 🔥 Initialisation de l’app Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Initialisation de l’authentification avec persistance (AsyncStorage)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// 💾 Initialisation de Firestore et Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
