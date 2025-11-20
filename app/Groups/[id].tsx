// app/groups/[id].tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
// 1. Importation de l'instance Firestore (db)
import { db } from "../../services/firebaseConfig"; // Assurez-vous que le chemin d'importation est correct
// 2. Importation des fonctions Firestore nécessaires
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

// Définition du type pour les données du groupe
interface GroupData {
  name: string;
  description: string;
  members: string[]; // Tableau des IDs des membres
  // Ajoutez d'autres champs si nécessaire (e.g., creatorId, createdAt)
}

export default function GroupDetail() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  // ⚠️ Placeholder pour l'ID de l'utilisateur connecté. 
  // Remplacez par l'ID réel de l'utilisateur authentifié (e.g., auth.currentUser.uid)
  const currentUserId = "user_test_123"; 
  const isMember = group?.members.includes(currentUserId) ?? false;

  // 3. Fonction pour récupérer les détails du groupe
  const fetchGroupDetails = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const groupRef = doc(db, "groups", groupId);
      const docSnap = await getDoc(groupRef);

      if (docSnap.exists()) {
        setGroup(docSnap.data() as GroupData);
      } else {
        Alert.alert("Erreur", "Ce groupe n'existe pas.");
        router.back();
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du groupe:", error);
      Alert.alert("Erreur", "Impossible de charger les détails du groupe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  // 4. Fonction pour rejoindre ou quitter le groupe
  const toggleMembership = async () => {
    if (!groupId || !currentUserId) return;

    setIsJoining(true);
    try {
      const groupRef = doc(db, "groups", groupId);
      
      const updateAction = isMember ? arrayRemove(currentUserId) : arrayUnion(currentUserId);
      const actionText = isMember ? "quitté" : "rejoint";

      await updateDoc(groupRef, {
        members: updateAction,
      });

      // Mise à jour optimiste de l'état local pour une meilleure UX
      setGroup(prev => {
        if (!prev) return null;
        const newMembers = isMember 
          ? prev.members.filter(id => id !== currentUserId)
          : [...prev.members, currentUserId];
        return { ...prev, members: newMembers };
      });

      Alert.alert("Succès", `Vous avez ${actionText} le groupe ${group?.name}.`);

    } catch (error) {
      console.error("Erreur lors de la modification de l'adhésion:", error);
      Alert.alert("Erreur", `Impossible de ${isMember ? 'quitter' : 'rejoindre'} le groupe.`);
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
      <SafeAreaView style={styles.container}>
        <Text style={{ color: "#fff" }}>Groupe non trouvé.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>{group.name}</Text>
      <Text style={styles.descriptionText}>{group.description}</Text>
      <Text style={styles.infoText}>Membres: {group.members.length}</Text>
      <Text style={styles.infoText}>ID du groupe: {groupId}</Text>
      
      <View style={styles.separator} />

      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => router.push(`/chat/${groupId}`)}
        disabled={!isMember} // Désactiver si l'utilisateur n'est pas membre (optionnel)
      >
        <Text style={styles.btnText}>Ouvrir le chat</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.btn, isMember ? styles.leaveBtn : styles.joinBtn, { marginTop: 8 }]} 
        onPress={toggleMembership}
        disabled={isJoining}
      >
        <Text style={styles.btnText}>{isJoining ? 'Chargement...' : (isMember ? 'Quitter le groupe' : 'Rejoindre le groupe')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000", 
    padding: 16 
  },
  headerText: { 
    color: "#FFD700", 
    fontSize: 24, 
    marginBottom: 8,
    fontWeight: 'bold',
  },
  descriptionText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  infoText: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 20,
  },
  btn: { 
    padding: 12, 
    borderRadius: 8, 
    alignItems: "center" 
  },
  joinBtn: {
    backgroundColor: "#FFD700",
  },
  leaveBtn: {
    backgroundColor: "#888",
  },
  btnText: { 
    fontWeight: "700",
    color: "#000",
  }
});