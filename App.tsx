// App.tsx
// Point d'entrée minimal lorsque l'on utilise expo-router
import { AuthProvider } from "./context/AuthContext";
import { Slot } from "expo-router";

export default function App() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}


