// app/(app)/groups.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from "../../hooks/useAuth";

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
}

export default function GroupsScreen() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }

    const loadGroups = async () => {
      try {
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des groupes:", error);
        setLoading(false);
      }
    };

    loadGroups();
  }, [user, authLoading]);

  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity 
      style={styles.groupCard} 
      onPress={() => router.push(`/Groups/${item.id}`)}
    >
      <Text style={styles.groupTitle}>{item.name}</Text>
      <Text style={styles.groupSubtitle}>{item.description}</Text>
      <Text style={styles.groupMemberCount}>{item.members.length} membres</Text>
    </TouchableOpacity>
  );

  if (authLoading || loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Chargement des groupes...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.loadingText}>Veuillez vous connecter pour voir vos groupes.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.headerTitle}>Mes Groupes d'Étude</Text>
      
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroupItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Vous n'avez rejoint aucun groupe pour l'instant.</Text>
          </View>
        )}
        contentContainerStyle={groups.length === 0 ? { flexGrow: 1 } : {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFD700',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  groupCard: {
    backgroundColor: '#111',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  groupSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  groupMemberCount: {
    fontSize: 12,
    color: '#FFD700',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
  }
});



