/* eslint-disable no-undef */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import fs from 'fs/promises'
import path from 'path'
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

async function backupFirestore() {
  try {
    const backup = {}
    const collections = ['coffee', 'users'] // Add any other collections you want to backup

    for (const collectionName of collections) {
      console.log(`Backing up ${collectionName} collection...`)
      const collectionRef = collection(db, collectionName)
      const snapshot = await getDocs(collectionRef)

      backup[collectionName] = {}

      snapshot.forEach((doc) => {
        backup[collectionName][doc.id] = doc.data()
      })

      console.log(`Backed up ${snapshot.size} documents from ${collectionName}`)
    }

    // Create backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups')
    await fs.mkdir(backupDir, { recursive: true })

    // Save backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(backupDir, `firestore-backup-${timestamp}.json`)

    await fs.writeFile(backupPath, JSON.stringify(backup, null, 2))
    console.log(`Backup saved to: ${backupPath}`)

    return backupPath
  } catch (error) {
    console.error('Error creating backup:', error)
    throw error
  }
}

// Run the backup
backupFirestore()
  .then((backupPath) => {
    console.log('Backup completed successfully!')
    console.log(`Backup file: ${backupPath}`)
  })
  .catch((error) => {
    console.error('Backup failed:', error)
    process.exit(1)
  })
