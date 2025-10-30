// app/calendar.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DATA = [
  { id: "1", title: "Séance Math", time: "08:00" },
  { id: "2", title: "Séance Physique", time: "10:00" }
];

export default function Calendar() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000", padding: 12 }}>
      <Text style={{ color: "#FFD700", fontSize: 20, marginBottom: 8 }}>Calendrier</Text>
      <FlatList data={DATA} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={{ fontWeight: "700" }}>{item.title}</Text>
          <Text style={{ color: "#666" }}>{item.time}</Text>
        </View>
      )} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#111", padding: 12, borderRadius: 10, marginBottom: 8 }
});
