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
export function generateCoffeeThumbnail(url) {
  const options = { size: { height: 400, width: 800 }, bgColor: '#e3e3e3' }

  // the scraper previews coffee cards with images from their own CDNs, not our cloudinary ones
  if (!url.includes('res.cloudinary.com')) return url

  return transformCloudinaryURL(url, options)
}
