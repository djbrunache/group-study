// app/(app)/calendar.tsx
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../services/supabaseClient";

interface Event {
  id: string;
  title: string;
  startTime: string;
  groupId: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(false);
      } catch (error: any) {
        console.error("Erreur lors de la récupération des événements:", error);
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const renderItem = ({ item }: { item: Event }) => {
    const date = new Date(item.startTime);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString();

    return (
      <View style={styles.card}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.timeText}>{dateString} à {timeString}</Text>
        <Text style={styles.groupText}>Groupe ID: {item.groupId}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={{ color: "#FFD700", marginTop: 10 }}>Chargement du calendrier...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Calendrier</Text>
      <FlatList 
        data={events} 
        keyExtractor={(i) => i.id} 
        renderItem={renderItem} 
        ListEmptyComponent={() => <Text style={styles.emptyText}>Aucun événement à venir.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000", 
    padding: 12 
  },
  headerText: { 
    color: "#FFD700", 
    fontSize: 20, 
    marginBottom: 8 
  },
  card: { 
    backgroundColor: "#111", 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 8 
  },
  titleText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 16,
  },
  timeText: { 
    color: "#FFD700",
    fontSize: 14,
    marginTop: 4,
  },
  groupText: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: "#888",
    textAlign: 'center',
    marginTop: 20,
  }
});



