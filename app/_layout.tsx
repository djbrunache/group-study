// app/_layout.tsx
import { Stack } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { ClerkProvider } from "@clerk/clerk-expo";
import { useAuth } from "../hooks/useAuth";
import { clerkPublishableKey } from "../services/clerkConfig";

// Composant pour l'écran de chargement
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#FFD700" />
  </View>
);

function RootLayoutContent() {
  const { user, loading, isSignedIn } = useAuth();

  // 1. Afficher l'écran de chargement pendant la vérification de l'état
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 2. Si l'utilisateur n'est PAS connecté, afficher le groupe d'authentification */}
      {!isSignedIn ? (
        <Stack.Screen name="(auth)" />
      ) : (
        // 3. Si l'utilisateur EST connecté, afficher le groupe de l'application principale
        <Stack.Screen name="(app)" />
      )}
      
      {/* 4. Écrans accessibles depuis les deux groupes */}
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="Groups/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  if (!clerkPublishableKey) {
    console.error("❌ EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY n'est pas définie");
    return <LoadingScreen />;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <RootLayoutContent />
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  }
});