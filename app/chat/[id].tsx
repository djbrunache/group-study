// app/chat/[id].tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
// 1. Importation de l'instance Firestore (db) depuis votre fichier de configuration
import { db } from "../../services/firebaseConfig";
// 2. Importation des fonctions Firestore nécessaires
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

// Définition du type pour un message Firestore
interface Message {
  id: string;
  text: string;
  createdAt: Date; // Firestore stocke un Timestamp, mais nous le convertissons en Date
  userId: string; // Ajout d'un ID utilisateur pour identifier l'expéditeur
}

export default function Chat() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ⚠️ Placeholder pour l'ID de l'utilisateur connecté. 
  // Vous devriez le remplacer par l'ID réel de l'utilisateur authentifié (e.g., auth.currentUser.uid)
  const currentUserId = "user_test_123"; 

  // 3. Listener en temps réel pour les messages
  useEffect(() => {
    if (!chatId) return;

    // Référence à la collection de messages pour ce chat spécifique
    const messagesRef = collection(db, "chats", chatId, "messages");
    
    // Requête : trier par date de création (du plus récent au plus ancien)
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    // onSnapshot établit la connexion en temps réel
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(), // Convertir le Timestamp en Date
      })) as Message[];
      
      setMsgs(fetchedMessages);
      setLoading(false);
    }, (error) => {
      console.error("Erreur lors de la récupération des messages:", error);
      setLoading(false);
    });

    // Nettoyage du listener lors du démontage du composant
    return () => unsubscribe();
  }, [chatId]);

  // 4. Fonction d'envoi de message vers Firestore
  const send = async () => {
    if (!msg.trim() || !chatId) return;

    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      
      await addDoc(messagesRef, {
        text: msg.trim(),
        createdAt: serverTimestamp(), // Utiliser le timestamp du serveur pour la cohérence
        userId: currentUserId,
      });

      setMsg(""); // Vider le champ de saisie après l'envoi
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      // Afficher une notification d'erreur à l'utilisateur si nécessaire
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.userId === currentUserId;
    
    return (
      <View style={[styles.bubble, isCurrentUser ? styles.myBubble : styles.otherBubble]}>
        <Text style={isCurrentUser ? styles.myText : styles.otherText}>{item.text}</Text>
        <Text style={styles.timestamp}>{item.createdAt.toLocaleTimeString()}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={{ color: "#FFD700", marginTop: 10 }}>Chargement des messages...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Chat groupe {chatId}</Text>
      <FlatList 
        data={msgs} 
        inverted
        keyExtractor={(i) => i.id} 
        renderItem={renderItem} 
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.inputRow}>
        <TextInput 
          style={styles.input} 
          value={msg} 
          onChangeText={setMsg} 
          placeholder="Message..." 
          placeholderTextColor="#999" 
          onSubmitEditing={send} // Permet d'envoyer avec la touche Entrée
          blurOnSubmit={false}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Text style={styles.sendBtnText}>OK</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000", 
    padding: 8 
  },
  headerText: { 
    color: "#FFD700", 
    fontSize: 18, 
    marginBottom: 10 
  },
  listContent: {
    paddingHorizontal: 8,
  },
  bubble: { 
    padding: 10, 
    borderRadius: 15, 
    marginBottom: 8,
    maxWidth: '80%',
  },
  otherBubble: {
    backgroundColor: "#222",
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  myBubble: {
    backgroundColor: "#FFD700", // Couleur or pour mes messages
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  otherText: { 
    color: "#fff" 
  },
  myText: {
    color: "#000", // Texte noir sur fond or
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
    color: 'rgba(0, 0, 0, 0.6)', // Couleur sombre pour le timestamp sur fond or
  },
  inputRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 6,
    borderTopWidth: 1,
    borderTopColor: '#111',
  },
  input: { 
    flex: 1, 
    backgroundColor: "#111", 
    color: "#fff", 
    padding: 10, 
    borderRadius: 20, // Rendu plus moderne
    marginRight: 8,
  },
  sendBtn: { 
    backgroundColor: "#FFD700", 
    padding: 10, 
    borderRadius: 20, 
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: {
    color: "#000", // Texte noir sur fond or
    fontWeight: 'bold',
  }
});