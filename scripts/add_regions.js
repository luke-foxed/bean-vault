/* eslint-disable no-undef */
import { initializeApp } from 'firebase/app'
import { doc, getFirestore, setDoc, deleteDoc } from 'firebase/firestore'
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
    { id: 9, name: 'Indonesia', color: 'lime' },
    { id: 10, name: 'Yemen', color: 'indigo' },
    { id: 11, name: 'Honduras', color: 'violet' },
    { id: 12, name: 'Mexico', color: 'pink' },
    { id: 13, name: 'Rwanda', color: 'indigo' },
    { id: 14, name: 'Peru', color: 'yellow' },
    { id: 15, name: 'India', color: 'red' },
    { id: 16, name: 'El Salvador', color: 'blue' },
    { id: 17, name: 'Burundi', color: 'violet' },
    { id: 18, name: 'China', color: 'red' },
    { id: 19, name: 'Tanzania', color: 'orange' },
    { id: 20, name: 'Nicaragua', color: 'green' },
    { id: 21, name: 'Papua New Guinea', color: 'yellow' },
    { id: 22, name: 'Hawaii', color: 'pink' },
    { id: 23, name: 'Vietnam', color: 'blue' },
    { id: 24, name: 'Uganda', color: 'grape' },
    { id: 25, name: 'Myanmar', color: 'indigo' },
  ]

  const regionsDocRef = doc(db, 'regions', 'all')

  // Delete existing regions document
  try {
    await deleteDoc(regionsDocRef)
    console.log('Existing regions document deleted successfully')
  } catch (error) {
    console.log('No existing regions document to delete:', error.message)
  }

  // Store all regions in a single document
  await setDoc(regionsDocRef, { regions }, { merge: true })
  console.log(`Added ${regions.length} regions successfully!`)
}

addRegionDocuments().catch((error) => console.error('Error adding regions:', error))
