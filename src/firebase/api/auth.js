/* eslint-disable no-useless-catch */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'

import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../config'

// auth based endpoints
export const firebaseSignup = async (userDetails) => {

  const { email, password, name } = userDetails
  const res = await createUserWithEmailAndPassword(auth, email, password)
  const user = res.user

  return setDoc(doc(db, 'users', user.uid), {
    name: name,
    email: user.email,
    role: 'blocked',
  })
}

export const firebaseLogin = async (email, password) => {
  const loginStuff = await signInWithEmailAndPassword(auth, email, password)
  return loginStuff
}

export const firebaseLoginGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const res = await signInWithPopup(auth, provider)
  const userRef = doc(db, 'users', res.user.uid)

  // check if the user exists first
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: res.user.email,
      name: res.user.displayName,
      role: 'blocked',
    })
  }

  return res.user
}

export const firebaseFetchAllUsers = async () => {
  try {
    const usersCollectionRef = collection(db, 'users')
    const usersSnapshot = await getDocs(usersCollectionRef)
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return users
  } catch (error) {
    throw error
  }
}

export const firebaseUpdateUserRole = async (userId, newRole) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, { role: newRole })
    return { success: true }
  } catch (error) {
    throw error
  }
}

export const firebaseDeleteUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    await deleteDoc(userRef)
    return { success: true }
  } catch (error) {
    throw error
  }
}

export const firebaseLogout = async () => {
  return signOut(auth)
}

// firestore based endpoints
export const firebaseFetchUser = async (userUID) => {
  return (await getDoc(doc(db, 'users', userUID))).data()
}
