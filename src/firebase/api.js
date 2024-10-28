import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'

import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { auth, db } from './config'

// auth based endpoints
export const firebaseSignup = async (email, password) => {
  const res = await createUserWithEmailAndPassword(auth, email, password)
  const user = res.user

  return setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    role: 'viewer',
  })
}

export const firebaseLogin = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const firebaseLoginGoogle = async () => {
  const provider = new GoogleAuthProvider()

  return signInWithPopup(auth, provider)
}

export const firebaseLogout = async () => {
  return signOut(auth)
}

// firestore based endpoints
export const firebaseFetchUser = async (userUID) => {
  return (await getDoc(doc(db, 'users', userUID))).data()
}

export const fetchCoffeeItems = async () => {
  const coffeeSnapshot = await getDocs(collection(db, 'coffee'))
  const coffeeList = coffeeSnapshot.docs.map((doc) => ({
    id: doc.id, // Include the document ID
    ...doc.data(), // Spread the rest of the document data
  }))
  return coffeeList
}
