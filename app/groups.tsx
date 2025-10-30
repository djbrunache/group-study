// app/groups.tsx
import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// Exemple mock (remplacer par Firestore)
const MOCK = [
  { id: "g1", name: "Groupe Math 1", subject: "Mathématiques" },
  { id: "g2", name: "Groupe Physique", subject: "Physique" },
];

export default function Groups() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = MOCK.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()) || g.subject.toLowerCase().includes(query.toLowerCase()));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000", padding: 12 }}>
      <Text style={{ color: "#FFD700", fontSize: 20, marginBottom: 8 }}>Groupes</Text>
      <TextInput style={styles.search} placeholder="Rechercher un groupe" value={query} onChangeText={setQuery} />
      <FlatList data={filtered} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => router.push(`/groups/${item.id}`)}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>{item.name}</Text>
          <Text style={{ color: "#ccc" }}>{item.subject}</Text>
        </TouchableOpacity>
      )} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  search: { backgroundColor: "#222", color: "#fff", padding: 10, borderRadius: 8, marginBottom: 10 },
  item: { backgroundColor: "#111", padding: 12, borderRadius: 10, marginBottom: 8 }
});
