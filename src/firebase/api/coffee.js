/* eslint-disable no-useless-catch */
import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../config'
import { uploadImageToCloudinary } from '../../cloudinary/api'
import { buildCoffeeQuery } from '../helpers'
import { firebaseFetchRegions } from './regions'

export const firebaseFetchCoffees = async (queryParams) => {
  try {
    let coffeeQuery = collection(db, 'coffee')

    coffeeQuery = buildCoffeeQuery(coffeeQuery, queryParams)

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
  } catch (error) {
    throw error
  }
}

export const firebaseFetchCoffeesByIds = async (coffeeIds) => {
  const [coffeeSnaps, regions] = await Promise.all([Promise.all(coffeeIds.map((id) => getDoc(doc(db, 'coffee', id)))), firebaseFetchRegions()])
  const regionsMap = Object.fromEntries(regions.map((region) => [region.id, { name: region.name, color: region.color }]))
  // keep track of fetched roasters to avoid fetching the same roaster multiple times
  const roastersMap = new Map()

  const coffeeData = await Promise.all(coffeeSnaps.map(async (docSnap) => {
    if (!docSnap.exists()) return null

    const data = docSnap.data()
    let roaster = null

    if (!roastersMap.has(data.roaster)) {
      const roasterSnap = await getDoc(doc(db, 'roasters', data.roaster))
      roaster = { id: roasterSnap.id, ...roasterSnap.data() }
      roastersMap.set(data.roaster, roaster)
    } else {
      roaster = roastersMap.get(data.roaster)
    }

    // Map regions using the regionsMap
    const coffeeRegions = (data.regions || []).map((regionId) => regionsMap[regionId]).filter(Boolean)

    return { id: docSnap.id, ...data, roaster, regions: coffeeRegions }
  }))
  return coffeeData.filter(Boolean)
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

// no need to fetch the roasters or regions here since the edit flow already fetches them
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

export const firebaseAddCoffee = async (coffeeData) => {
  try {
    const { image, ...coffee } = coffeeData
    const imageUrl = await uploadImageToCloudinary(image, 'coffee_upload')
    const coffeeRef = collection(db, 'coffee')
    const coffeeWithDate = { ...coffee, date_added: serverTimestamp(), image: imageUrl }
    return { res: addDoc(coffeeRef, coffeeWithDate) }
  } catch (error) {
    throw error
  }
}

export const firebaseUpdateCoffee = async (coffeeData) => {
  try {
    const { date_added, image, id, refresh_image, ...coffee } = coffeeData

    if (refresh_image) {
      const imageUrl = await uploadImageToCloudinary(image, 'coffee_upload')
      coffee.image = imageUrl
    }

    const coffeeRef = doc(db, 'coffee', id)
    const coffeeWithUpdate = { ...coffee }

    await updateDoc(coffeeRef, coffeeWithUpdate)

    return { res: true }
  } catch (error) {
    throw error
  }
}

export const firebaseDeleteCoffee = async (coffeeId) => {
  try {
    const coffeeRef = doc(db, 'coffee', coffeeId)
    await deleteDoc(coffeeRef)
  } catch (error) {
    throw error
  }
}

export const firebaseFetchCoffeeCount = async () => {
  try {
    const coffeeRef = collection(db, 'coffee')
    const coffeeSnap = await getCountFromServer(coffeeRef)

    return coffeeSnap.data().count
  } catch (error) {
    throw error
  }
}
