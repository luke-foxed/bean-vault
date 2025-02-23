/* eslint-disable no-undef */
import { initializeApp } from 'firebase/app'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import 'dotenv/config'

const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function addRegionDocuments() {
  const regions = [
    { id: 1, name: 'Ethiopia', color: 'orange' },
    { id: 2, name: 'Brazil', color: 'green' },
    { id: 3, name: 'Colombia', color: 'yellow' },
    { id: 4, name: 'Costa Rica', color: 'teal' },
    { id: 5, name: 'Kenya', color: 'red' },
    { id: 6, name: 'Guatemala', color: 'grape' },
    { id: 7, name: 'Jamaica', color: 'blue' },
    { id: 8, name: 'Panama', color: 'cyan' },
    { id: 9, name: 'Sumatra', color: 'lime' },
    { id: 10, name: 'Yemen', color: 'brown' },
    { id: 11, name: 'Honduras', color: 'violet' },
    { id: 12, name: 'Mexico', color: 'pink' },
    { id: 13, name: 'Rwanda', color: 'indigo' },
    { id: 14, name: 'Peru', color: 'gold' },
    { id: 15, name: 'India', color: 'red' },
  ]

  // Store all regions in a single document
  const regionsDocRef = doc(db, 'regions', 'all')

  await setDoc(regionsDocRef, { regions }, { merge: true })
  console.log('Regions added successfully in a single document!')
}

addRegionDocuments()
  .catch((error) => console.error('Error adding regions:', error))
