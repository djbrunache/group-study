// services/clerkConfig.ts
// Expose Clerk publishable key from Expo env variables
export const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

if (!clerkPublishableKey) {
  console.error("❌ EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY n'est pas définie");
}
