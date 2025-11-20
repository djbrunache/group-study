// app/(auth)/sign-up.tsx
import { SignUp } from "@clerk/clerk-expo";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SignUp 
          routing="path"
          path="/(auth)/sign-up"
          signInUrl="/(auth)/sign-in"
          afterSignUpUrl="/(app)"
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


