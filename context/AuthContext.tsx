// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../app/services/firebase";

interface UserData {
  uid: string;
  email: string;
  name?: string;
  university?: string;
  subjects?: string[];
  createdAt?: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // écoute les changements de connexion Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) setUserData(userDoc.data() as UserData);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => await signOut(auth);

  return (
    <AuthContext.Provider value={{ user, userData, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
