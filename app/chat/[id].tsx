// app/chat/[id].tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../hooks/useAuth";

interface Message {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
}

export default function Chat() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = user?.id || "";

  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      try {
        setLoading(false);
      } catch (error: any) {
        console.error("Erreur lors de la récupération des messages:", error);
        setLoading(false);
      }
    };

    loadMessages();
  }, [chatId]);

  const send = async () => {
    if (!msg.trim() || !chatId) return;

    try {
      setMsg("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.userId === currentUserId;

    return (
      <View style={[styles.bubble, isCurrentUser ? styles.myBubble : styles.otherBubble]}>
        <Text style={[styles.bubbleText, isCurrentUser ? styles.myText : styles.otherText]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD700" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={msgs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        inverted
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          placeholderTextColor="#666"
          value={msg}
          onChangeText={setMsg}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Text style={styles.sendText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContent: {
    padding: 10,
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD700',
    marginRight: 10,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    marginLeft: 10,
  },
  bubbleText: {
    fontSize: 16,
  },
  myText: {
    color: '#000',
  },
  otherText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  sendText: {
    color: '#000',
    fontWeight: '600',
  },
});
