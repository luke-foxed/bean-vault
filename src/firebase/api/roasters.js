/* eslint-disable no-useless-catch */
import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../config'
import { uploadImageToCloudinary } from '../../cloudinary/api'

export const firebaseFetchRoasters = async () => {
  try {
    const roastersCollectionRef = collection(db, 'roasters')
    const roastersDocs = await getDocs(roastersCollectionRef)
    const roasters = roastersDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    return roasters
  } catch (error) {
    throw error
  }
}

export const firebaseFetchRoaster = async (roasterId) => {
  try {
    const roasterRef = doc(db, 'roasters', roasterId)
    const roasterSnap = await getDoc(roasterRef)
    return roasterSnap.exists() ? { id: roasterSnap.id, ...roasterSnap.data() } : null
  } catch (error) {
    throw error
  }
}

export const firebaseAddRoaster = async (roasterData) => {
  try {
    const { image, ...roaster } = roasterData
    const imageUrl = await uploadImageToCloudinary(image, 'roaster_upload')
    const roasterRef = collection(db, 'roasters')
    const roasterWithDate = { ...roaster, date_added: serverTimestamp(), image: imageUrl }
    return { res: addDoc(roasterRef, roasterWithDate) }
  } catch (error) {
    throw error
  }
}

export const firebaseUpdateRoaster = async (roasterData) => {
  try {
    const { image, ...roaster } = roasterData

    let imageUrl = image

    if (imageUrl instanceof File) {
      imageUrl = await uploadImageToCloudinary(imageUrl, 'roaster_upload')
    }

    const roasterRef = doc(db, 'roasters', roaster.id)
    const roasterWithUpdate = { ...roaster, image: imageUrl }

    await updateDoc(roasterRef, roasterWithUpdate)

  } catch (error) {
    throw error
  }
}

export const firebaseDeleteRoaster = async (roasterId) => {
  try {
    const roasterRef = doc(db, 'roasters', roasterId)
    await deleteDoc(roasterRef)
  } catch (error) {
    throw error
  }
}

export const firebaseFetchRoasterCount = async () => {
  const roasterRef = collection(db, 'roasters')
  const roasterSnap = await getCountFromServer(roasterRef)
  return roasterSnap.data().count
}
