export function formatFirestoreTimestamp(timestamp) {
  const date = new Date(timestamp?.seconds * 1000) // Convert seconds to milliseconds
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export function transformCloudinaryURL(url, options) {
  if (!url) return ''

  const { size, bgColor } = options
  const transformations = []

  if (size) {
    const { width, height } = size
    transformations.push(`ar_16:9,w_${width},h_${height},c_pad`)
  }

  // // expects a hex color
  if (bgColor) {
    const cleanBgColor = bgColor.replace('#', '')
    transformations.push(`b_rgb:${cleanBgColor}`)
  }

  const [base, publicId] = url.split('/upload/')
  const transformationString = transformations.length > 0 ? `${transformations.join(',')}/` : ''

  return `${base}/upload/${transformationString}${publicId}`
}

// for quickly generating a 'fixed' image with a non-transparent bg and uniform size
export const generateCoffeeThumbnail = (url) => {
  const tranformationOptions = { size: { height: 400, width: 800 }, bgColor: '#e3e3e3' }
  if (!url) return null
  // If it's already a Cloudinary URL, return as is
  if (!url.includes('res.cloudinary.com')) {
    const encodedUrl = encodeURIComponent(url)
    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/fetch/t_coffee_upload/${encodedUrl}`
  }

  // For non-Cloudinary URLs, use Cloudinary's fetch feature with f_auto
  return transformCloudinaryURL(url, tranformationOptions)
}
