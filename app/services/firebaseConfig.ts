// app/services/firebaseConfig.ts
// Re-export the real firebase config from the root-level services so this file
// can remain under `app/` (Expo Router expects a default export).
export { db, storage, initializeAuthPersistence, auth as getAuthInstance } from "../../services/firebaseConfig";

import React from 'react';
export default function _FirebaseConfigRoute() {
  return null;
}
