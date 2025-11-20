// app/(app)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: { backgroundColor: "#000" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ 
          title: "Accueil", 
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> 
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{ 
          title: "Groupes", 
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> 
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{ 
          title: "Calendrier", 
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} /> 
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ 
          title: "Profil", 
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> 
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{ href: null }}
      />
    </Tabs>
  );
}


