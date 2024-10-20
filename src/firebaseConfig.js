import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.VITE_API_KEY,
  authDomain: import.meta.VITE_AUTH_DOMAIN,
  projectId: import.meta.VITE_PROJECT_ID,
  storageBucket: import.meta.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.VITE_MESSAGING_SENDER_ID,
  appId:import.meta. VITE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
