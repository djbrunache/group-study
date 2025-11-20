// app/(auth)/sign-in.tsx
import { SignIn } from "@clerk/clerk-expo";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function SignInScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SignIn 
          routing="path"
          path="/(auth)/sign-in"
          signUpUrl="/(auth)/sign-up"
          afterSignInUrl="/(app)"
          appearance={{
            elements: {
              rootBox: { backgroundColor: "#000" },
              card: { backgroundColor: "#000" },
            }
          }}
        />
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
    justifyContent: "center",
    padding: 20,
  },
});


