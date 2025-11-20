// hooks/useAuth.ts
// ✅ Hook d'authentification utilisant Clerk
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-expo";

export function useAuth() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useClerkAuth();

  const loading = !userLoaded || !authLoaded;

  return {
    user: user ? {
      uid: user.id,
      email: user.primaryEmailAddress?.emailAddress || null,
      displayName: user.fullName || user.firstName || null,
    } : null,
    loading,
    isSignedIn: isSignedIn || false,
  };
}
