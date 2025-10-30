// app/chat/[id].tsx
// Placeholder pour la messagerie. Remplacer par impl. Firestore + real-time listeners.
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState<{ id: string; text: string }[]>([]);

  const send = () => {
    if (!msg) return;
    setMsgs((s) => [{ id: Date.now().toString(), text: msg }, ...s]);
    setMsg("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000", padding: 8 }}>
      <Text style={{ color: "#FFD700", fontSize: 18 }}>Chat groupe {id}</Text>
      <FlatList data={msgs} inverted keyExtractor={(i) => i.id} renderItem={({ item }) => <View style={styles.bubble}><Text style={{ color: "#fff" }}>{item.text}</Text></View>} />
      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={msg} onChangeText={setMsg} placeholder="Message..." placeholderTextColor="#999" />
        <TouchableOpacity style={styles.sendBtn} onPress={send}><Text style={{ color: "#fff" }}>OK</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bubble: { backgroundColor: "#222", padding: 10, borderRadius: 8, marginBottom: 6 },
  inputRow: { flexDirection: "row", alignItems: "center", padding: 6 },
  input: { flex: 1, backgroundColor: "#111", color: "#fff", padding: 10, borderRadius: 8 },
  sendBtn: { backgroundColor: "#FFD700", padding: 10, borderRadius: 8, marginLeft: 8 }
});
