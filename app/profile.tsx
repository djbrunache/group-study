// app/profile.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profil étudiant</Text>
      <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }} style={styles.avatar} />
      <Text style={styles.name}>Alice Dupont</Text>
      <Text style={styles.info}>alice.dupont@email.com</Text>

      <TouchableOpacity style={styles.btn} onPress={() => router.push("/settings")}>
        <Text style={styles.btnText}>Paramètres</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center", padding: 18 },
  title: { color: "#FFD700", fontSize: 20, marginBottom: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { color: "#fff", fontSize: 18, fontWeight: "700" },
  info: { color: "#ccc", marginBottom: 12 },
  btn: { backgroundColor: "#FFD700", padding: 12, borderRadius: 10 },
  btnText: { fontWeight: "700" }
});
