/* eslint-disable no-useless-catch */
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../config'
import { uploadImageToCloudinary } from '../../cloudinary/api'
import { buildCoffeeQuery } from '../helpers'

export const firebaseFetchRegions = async () => {
  const regionsDocRef = doc(db, 'regions', 'all')
  const regionsDoc = await getDoc(regionsDocRef)

  const regionsArray = regionsDoc.data().regions.map((region) => ({ ...region, id: region.id.toString() })) || []
  return regionsArray
}

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
    const { date_added, image, id, ...coffee } = coffeeData
    let imageUrl = image

    if (imageUrl instanceof File) {
      imageUrl = await uploadImageToCloudinary(imageUrl, 'coffee_upload')
    }

    const coffeeRef = doc(db, 'coffee', id)
    const coffeeWithUpdate = { ...coffee, image: imageUrl }

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
