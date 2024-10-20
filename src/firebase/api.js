import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'
import { auth, db } from '../firebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// auth based endpoints
export const firebaseSignup = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    const user = res.user

    // Add the user to Firestore with the 'viewer' role
    return setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: 'viewer',
    })
  } catch (error) {
    return { error }
  }
}

export const firebaseLogin = async (email, password) => {
  try {
    return signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    return { error }
  }
}

export const firebaseLoginGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    return signInWithPopup(auth, provider)
  } catch (error) {
    return { error }
  }
}

export const firebaseLogout = async () => {
  try {
    return signOut(auth)
  } catch (error) {
    return { error }
  }
}

// firestore based endpoints
export const firebaseFetchUser = async (userUID) => {
  try {
    return (await getDoc(doc(db, 'users', userUID))).data()
  } catch (error) {
    return { error }
  }
}
