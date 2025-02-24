import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'

import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore'
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

export const firebaseFetchRegions = async () => {
  const regionsDocRef = doc(db, 'regions', 'all')
  const regionsDocSnap = await getDoc(regionsDocRef)

  const regionsArray = regionsDocSnap.data().regions || []
  return regionsArray
}

export const fetchCoffeeItems = async () => {
  const [coffeeSnapshot, regions] = await Promise.all([getDocs(collection(db, 'coffee')), firebaseFetchRegions()])

  const coffeeList = coffeeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  const regionsMap = Object.fromEntries(regions.map((region) => [region.id, { name: region.name, color: region.color }]))

  return coffeeList.map((coffee) => ({
    ...coffee,
    regions: (coffee.regions || [])
      .map((regionId) => regionsMap[regionId])
      .filter(Boolean),
  }))
}

export const firebaseAddCoffee = async (coffeeData) => {
  const coffeeRef = collection(db, 'coffee')
  const coffeeWithDate = { ...coffeeData, date_added: serverTimestamp() }

  return addDoc(coffeeRef, coffeeWithDate)
}
