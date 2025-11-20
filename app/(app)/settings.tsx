// app/(app)/settings.tsx
import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk } from "@clerk/clerk-expo";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState<"fr" | "ht">("fr");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { signOut } = useClerk();

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      Alert.alert("Erreur", "Impossible de se déconnecter.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const textColor = darkMode ? "#fff" : "#000";
  const backgroundColor = darkMode ? "#000" : "#fff";
  const primaryColor = "#FFD700";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: primaryColor }]}>Paramètres</Text>
      
      <View style={styles.row}>
        <Text style={[styles.rowText, { color: textColor }]}>Mode sombre</Text>
        <Switch 
          value={darkMode} 
          onValueChange={setDarkMode}
        />
      </View>

      <View style={styles.row}>
        <Text style={[styles.rowText, { color: textColor }]}>Langue : {lang === "fr" ? "Français" : "Kreyòl"}</Text>
        <TouchableOpacity 
          onPress={() => setLang((l) => (l === "fr" ? "ht" : "fr"))} 
          style={[styles.langBtn, { backgroundColor: primaryColor }]}
        >
          <Text style={styles.langBtnText}>{lang === "fr" ? "FR" : "HT"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.logout, { backgroundColor: isSigningOut ? "#888" : "#E53935" }]} 
        onPress={handleLogout}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.logoutText}>Se déconnecter</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 20 
  },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  rowText: {
    fontSize: 16,
  },
  langBtn: { 
    paddingHorizontal: 12,
    paddingVertical: 6, 
    borderRadius: 8, 
  },
  langBtnText: {
    fontWeight: 'bold',
    color: '#000',
  },
  logout: { 
    padding: 14, 
    borderRadius: 10, 
    marginTop: 30,
    alignItems: 'center',
  },
  logoutText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 16,
  }
});


