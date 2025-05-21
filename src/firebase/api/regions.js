import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config'

export const firebaseFetchRegions = async () => {
  const regionsDocRef = doc(db, 'regions', 'all')
  const regionsDoc = await getDoc(regionsDocRef)

  const regionsArray = regionsDoc.data().regions.map((region) => ({ ...region, id: region.id.toString() })) || []
  return regionsArray
}

export const firebaseFetchRegionsByIds = async (regionIds) => {
  const regionsDocRef = doc(db, 'regions', 'all')
  const regionsDoc = await getDoc(regionsDocRef)

  const regionsArray = regionsDoc.data().regions.filter((region) => regionIds.includes(region.id.toString()))
  return regionsArray
}
