/* eslint-disable no-useless-catch */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './config'
import { uploadImageToCloudinary } from '../cloudinary/api'

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

export const firebaseFetchAllCoffee = async ({ count = null, sortByField = null, sortDirection = 'desc' }) => {
  let coffeeQuery = collection(db, 'coffee')

  if (sortByField) coffeeQuery = query(coffeeQuery, orderBy(sortByField, sortDirection))

  if (count) coffeeQuery = query(coffeeQuery, limit(count))

  const [coffeeSnapshot, regions] = await Promise.all([getDocs(coffeeQuery), firebaseFetchRegions()])

  const coffeeList = coffeeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  const regionsMap = Object.fromEntries(regions.map((region) => [region.id, { name: region.name, color: region.color }]))

  const roasterIds = [...new Set(coffeeList.map((coffee) => coffee?.roaster))]
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
    roaster: roastersMap[coffee.roaster] || null,
    regions: (coffee.regions || []).map((regionId) => regionsMap[regionId]).filter(Boolean),
  }))
}

export const firebaseFetchCoffeeForEdit = async (coffeeId) => {
  try {
    const coffeeRef = doc(db, 'coffee', coffeeId)
    const coffeeSnap = await getDoc(coffeeRef)

    if (!coffeeSnap.exists()) throw new Error('No coffee found!')

    const coffeeData = { id: coffeeSnap.id, ...coffeeSnap.data() }

    return coffeeData
  } catch (error) {
    throw error
  }
}

export const firebaseFetchCoffee = async (coffeeId) => {
  try {
    const coffeeRef = doc(db, 'coffee', coffeeId)
    const coffeeSnap = await getDoc(coffeeRef)

    if (!coffeeSnap.exists()) throw new Error('No coffee found!')

    const coffeeData = { id: coffeeSnap.id, ...coffeeSnap.data() }
    const regions = await firebaseFetchRegions()
    const regionsMap = Object.fromEntries(regions.map((region) => [region.id, { name: region.name, color: region.color }]))
    const coffeeRegions = (coffeeData.regions || []).map((regionId) => regionsMap[regionId]).filter(Boolean)
    const roasterSnap = await getDoc(doc(db, 'roasters', coffeeData.roaster))
    const roaster = roasterSnap.exists() ? { id: roasterSnap.id, ...roasterSnap.data() } : null

    return {
      ...coffeeData,
      regions: coffeeRegions,
      roaster: roaster,
    }
  } catch (error) {
    throw error
  }
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

export const firebaseUpdateCoffee = async (coffeeData) => {
  try {
    const { date_added, image, id, ...coffee } = coffeeData
    let imageUrl = image

    if (imageUrl instanceof File) {
      imageUrl = await uploadImageToCloudinary(imageUrl)
    }

    const coffeeRef = doc(db, 'coffee', id)
    const coffeeWithUpdate = { ...coffee, image: imageUrl }

    await updateDoc(coffeeRef, coffeeWithUpdate)

    return { res: true }
  } catch (error) {
    throw error
  }
}
