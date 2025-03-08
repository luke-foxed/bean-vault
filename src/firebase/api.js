/* eslint-disable no-useless-catch */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'

import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from './config'
import { uploadImageToCloudinary } from '../cloudinary/api'

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
  const regionsDoc = await getDoc(regionsDocRef)

  const regionsArray = regionsDoc.data().regions.map((region) => ({ ...region, id: region.id.toString() })) || []
  return regionsArray
}

export const firebaseFetchRoasters = async () => {
  const roastersCollectionRef = collection(db, 'roasters')
  const roastersDocs = await getDocs(roastersCollectionRef)
  const roasters = roastersDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

  return roasters
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
    const { image, ...coffee } = coffeeData
    const imageUrl = await uploadImageToCloudinary(image)
    const coffeeRef = collection(db, 'coffee')
    const coffeeWithDate = { ...coffee, date_added: serverTimestamp(), image: imageUrl }
    return { res: addDoc(coffeeRef, coffeeWithDate) }
  } catch (error) {
    throw error
  }
}
