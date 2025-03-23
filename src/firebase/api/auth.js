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
  try {
    const { email, password, name } = userDetails
    const res = await createUserWithEmailAndPassword(auth, email, password)
    const user = { name: name, email: res.user.email, role: 'blocked' }

    await setDoc(doc(db, 'users', res.user.uid), user)

    return { ...res.user, ...user }
  } catch (error) {
    throw error
  }
}

export const firebaseLogin = async (email, password) => {
  const res = await signInWithEmailAndPassword(auth, email, password)
  const userRef = doc(db, 'users', res.user.uid)
  const user = await getDoc(userRef)
  return { ...res.user, ...user.data() }
}

export const firebaseLoginGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const res = await signInWithPopup(auth, provider)
    const userRef = doc(db, 'users', res.user.uid)

    // check if the user exists first
    let user = await (await getDoc(userRef))?.data()

    if (!user) {
      user = { email: res.user.email, name: res.user.displayName, role: 'blocked' }
      await setDoc(userRef, user)
    }

    return { ...res.user, ...user }
  } catch (error) {
    throw error
  }
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

export const firebaseDeleteUserAuth = async () => {
  try {
    return await auth.currentUser.delete()
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
