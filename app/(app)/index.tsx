// app/(app)/index.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Bienvenue{user?.name ? `, ${user.name}` : ''} !</Text>
        <Text style={styles.subtitle}>Prêt à étudier en groupe ?</Text>

        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push("/(app)/groups")}
          >
            <Ionicons name="people" size={32} color="#FFD700" />
            <Text style={styles.cardTitle}>Mes Groupes</Text>
            <Text style={styles.cardText}>Rejoignez ou créez des groupes d'étude</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push("/(app)/calendar")}
          >
            <Ionicons name="calendar" size={32} color="#FFD700" />
            <Text style={styles.cardTitle}>Calendrier</Text>
            <Text style={styles.cardText}>Consultez vos événements à venir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFD700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 30,
  },
  cardContainer: {
    gap: 15,
  },
  card: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 12,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: "#888",
  },
});



