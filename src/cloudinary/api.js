/* eslint-disable no-useless-catch */

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

export const uploadImageToCloudinary = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'coffee_upload')
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
