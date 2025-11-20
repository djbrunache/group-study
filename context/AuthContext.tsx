// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
// ⚠️ Changement : Utilisation de onSnapshot pour le temps réel
import { doc, onSnapshot } from "firebase/firestore"; 
// ⚠️ Correction du chemin d'importation
import { db, initializeAuthPersistence, auth } from "../services/firebaseConfig"; 

// Définition du type pour les données de profil (ajusté pour être plus précis)
interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  avatarUrl?: string; // Ajouté pour cohérence avec le composant Profile
  university?: string;
  subjects?: string[];
  createdAt?: string; // Stocké comme string dans Firestore
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null; // Renommé pour clarté
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};


// ... (UserProfile et AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 1. Listener Firebase Auth (pour l'état de connexion)
  useEffect(() => {
    let authUnsubscribe: () => void;
    let isMounted = true;

    const setupAuth = async () => {
      try {
        // 🚀 ÉTAPE CRUCIALE : Attendre la configuration de la persistance
        await initializeAuthPersistence();

        // Récupérer l'instance d'auth initialisée
        const authInstance = auth();

        // Mettre en place le listener SEULEMENT après la persistance
        if (isMounted && authInstance) {
          authUnsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
            setUser(firebaseUser);
          });
        }
      } catch (error) {
        console.error("Erreur fatale lors de l'initialisation de l'Auth:", error);
        if (isMounted) setLoading(false); // Arrêter le chargement en cas d'erreur
      }
    };

    setupAuth();

    return () => {
      isMounted = false;
      if (authUnsubscribe) authUnsubscribe();
    };
  }, []); // S'exécute une seule fois au montage

  // 2. Listener Firestore (pour les données de profil en temps réel)
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setLoading(false); // ⚠️ AJOUT : Définir loading à false si l'utilisateur est déconnecté
      return;
    }

    const profileRef = doc(db, "users", user.uid);
    
    const profileUnsubscribe = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        // ... (votre logique de fusion de données)
        const profileData = docSnap.data() as Omit<UserProfile, 'uid' | 'email'>;
        setUserProfile({
          uid: user.uid,
          email: user.email || '',
          ...profileData,
        });
      } else {
        // ... (votre logique de profil par défaut)
        setUserProfile({
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || undefined,
        });
      }
      setLoading(false); // ⚠️ DÉFINIR loading à false après avoir chargé le profil
    }, (error) => {
      console.error("Erreur lors de la récupération du profil Firestore:", error);
      setLoading(false);
    });

    return () => profileUnsubscribe();
  }, [user]); // Déclenché à chaque changement d'utilisateur

  const logout = async () => {
    const a = auth();
    if (!a) return console.error('Auth not initialized');
    await signOut(a);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
