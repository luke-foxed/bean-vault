/* eslint-disable no-useless-catch */

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

const imageUrlToImageBlob = async (url) => {
  const response = await fetch(url)
  const blob = await response.blob()
  return blob
}

export const uploadImageToCloudinary = async (file, preset) => {
  try {
    const formData = new FormData()
    let imageFile = file

    if (typeof file === 'string') {
      imageFile = await imageUrlToImageBlob(file)
    }

    formData.append('file', imageFile)
    formData.append('upload_preset', preset)
    formData.append('cloud_name', cloudName)
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (response.ok) {
      return data.secure_url
    } else {
      throw new Error(data.error.message)
    }
  } catch (error) {
    throw error
  }
}
