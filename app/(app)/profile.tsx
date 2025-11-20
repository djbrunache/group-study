// app/(app)/profile.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { useClerk } from "@clerk/clerk-expo";

export default function Profile() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={{ color: "#FFD700", marginTop: 10 }}>Chargement du profil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profil étudiant</Text>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>
          {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
        </Text>
      </View>
      <Text style={styles.name}>{user?.displayName || "Utilisateur"}</Text>
      <Text style={styles.info}>{user?.email || "Non disponible"}</Text>

      <TouchableOpacity style={styles.btn} onPress={() => router.push("/(app)/settings")}>
        <Text style={styles.btnText}>Paramètres</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.btn, styles.logoutBtn]} 
        onPress={handleLogout}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={[styles.btnText, styles.logoutBtnText]}>Déconnexion</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000", 
    alignItems: "center", 
    padding: 18 
  },
  title: { 
    color: "#FFD700", 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 20 
  },
  avatarPlaceholder: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#FFD700",
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFD700",
  },
  name: { 
    color: "#fff", 
    fontSize: 20, 
    fontWeight: "700",
    marginBottom: 4,
  },
  info: { 
    color: "#ccc", 
    marginBottom: 30,
    fontSize: 16,
  },
  btn: { 
    backgroundColor: "#FFD700", 
    padding: 12, 
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnText: { 
    fontWeight: "700",
    color: "#000",
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: "#333",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#888",
  },
  logoutBtnText: {
    color: "#FFF",
  }
});


