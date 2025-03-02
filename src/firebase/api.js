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

export const firebaseFetchAllCoffee = async () => {
  const [coffeeSnapshot, regions] = await Promise.all([getDocs(collection(db, 'coffee')), firebaseFetchRegions()])

  const coffeeList = coffeeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  const regionsMap = Object.fromEntries(regions.map((region) => [region.id, { name: region.name, color: region.color }]))

  // Fetch roaster data
  const roasterIds = [...new Set(coffeeList.map((coffee) => coffee?.roaster_id))]
  const roasterDocs = await Promise.all(
    roasterIds.map(async (id) => {
      if (!id) return null
      const roasterSnap = await getDoc(doc(db, 'roasters', id))
      return roasterSnap.exists() ? { id: roasterSnap.id, ...roasterSnap.data() } : null
    }),
  )

  const roastersMap = Object.fromEntries(roasterDocs.filter(Boolean).map((roaster) => [roaster.id, roaster]))

  return coffeeList.map((coffee) => ({
    ...coffee,
    roaster: roastersMap[coffee.roaster_id] || null,
    regions: (coffee.regions || []).map((regionId) => regionsMap[regionId]).filter(Boolean),
  }))
}

export const firebaseAddCoffee = async (coffeeData) => {
  try {
    const coffeeRef = collection(db, 'coffee')
    const coffeeWithDate = { ...coffeeData, date_added: serverTimestamp() }
    return { res: addDoc(coffeeRef, coffeeWithDate) }
  } catch (error) {
    return { error }
  }
}
