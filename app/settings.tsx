// app/settings.tsx
import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<"fr" | "ht">("fr"); // FR / Créole haïtien (placeholder)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? "#000" : "#fff", padding: 16 }}>
      <Text style={{ fontSize: 20, color: darkMode ? "#FFD700" : "#000", marginBottom: 12 }}>Paramètres</Text>
      <View style={styles.row}>
        <Text style={{ color: darkMode ? "#fff" : "#000" }}>Mode sombre</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <View style={styles.row}>
        <Text style={{ color: darkMode ? "#fff" : "#000" }}>Langue : {lang === "fr" ? "Français" : "Kreyòl"}</Text>
        <TouchableOpacity onPress={() => setLang((l) => (l === "fr" ? "ht" : "fr"))} style={styles.langBtn}>
          <Text>{lang === "fr" ? "FR" : "HT"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.logout, { backgroundColor: "#E53935" }]} onPress={() => alert("Déconnexion (placeholder)")}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Se déconnecter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  langBtn: { padding: 8, borderRadius: 8, backgroundColor: "#ddd" },
  logout: { padding: 12, borderRadius: 10, marginTop: 20 }
});
