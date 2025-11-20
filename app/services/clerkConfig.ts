// app/services/clerkConfig.ts
// Re-export the real config from the root-level services so this file
// can remain under `app/` (Expo Router expects a default export).
export { clerkPublishableKey } from "../../services/clerkConfig";

// Provide a no-op default React component so Expo Router won't warn
import React from 'react';
export default function _ClerkConfigRoute() {
  return null;
}

