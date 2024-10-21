import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'

import { doc, getDoc, setDoc } from 'firebase/firestore'
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
