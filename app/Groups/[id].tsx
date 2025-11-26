// app/groups/[id].tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../hooks/useAuth";

interface GroupData {
  id: string;
  name: string;
  description: string;
  members: string[];
}

export default function GroupDetail() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const currentUserId = user?.id || "";
  const isMember = group?.members.includes(currentUserId) ?? false;

  const fetchGroupDetails = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération du groupe:", error);
      Alert.alert("Erreur", "Impossible de charger les détails du groupe.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const toggleMembership = async () => {
    if (!groupId || !currentUserId) return;

    setIsJoining(true);
    try {
      const actionText = isMember ? "quitté" : "rejoint";

      setGroup(prev => {
        if (!prev) return null;
        const newMembers = isMember
          ? prev.members.filter(id => id !== currentUserId)
          : [...prev.members, currentUserId];

        return { ...prev, members: newMembers };
      });

      Alert.alert("Succès", `Vous avez ${actionText} le groupe.`);
    } catch (error) {
      console.error("Erreur lors de la modification de l'adhésion:", error);
      Alert.alert("Erreur", "Impossible de modifier votre adhésion au groupe.");
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={{ color: "#FFD700", marginTop: 10 }}>Chargement du groupe...</Text>
      </SafeAreaView>
    );
  }

  if (!group) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: "#fff" }}>Le groupe n'existe pas.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{group.name}</Text>
      <Text style={styles.description}>{group.description}</Text>

      <View style={styles.stats}>
        <Text style={styles.statText}>Membres: {group.members.length}</Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, isMember ? styles.btnDanger : styles.btnPrimary]}
        onPress={toggleMembership}
        disabled={isJoining}
      >
        {isJoining ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>
            {isMember ? "Quitter le groupe" : "Rejoindre le groupe"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>Retour</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 20,
    lineHeight: 24,
  },
  stats: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600",
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  btnPrimary: {
    backgroundColor: "#FFD700",
  },
  btnDanger: {
    backgroundColor: "#ff6b6b",
  },
  btnText: {
    fontWeight: "700",
    color: "#000",
    fontSize: 16,
  },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#333",
    borderRadius: 10,
    alignItems: "center",
  },
  backBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
