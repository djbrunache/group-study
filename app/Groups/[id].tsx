// app/groups/[id].tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function GroupDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000", padding: 16 }}>
      <Text style={{ color: "#FFD700", fontSize: 20, marginBottom: 8 }}>Détails du groupe</Text>
      <Text style={{ color: "#fff", marginBottom: 12 }}>ID du groupe: {id}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.push(`/chat/${id}`)}><Text style={styles.btnText}>Ouvrir le chat</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { backgroundColor: "#888", marginTop: 8 }]} onPress={() => alert("Rejoindre le groupe (placeholder)")}>
        <Text style={styles.btnText}>Rejoindre</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: "#FFD700", padding: 12, borderRadius: 8, alignItems: "center" },
  btnText: { fontWeight: "700" }
});
