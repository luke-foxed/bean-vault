export function formatFirestoreTimestamp(timestamp) {
  const date = new Date(timestamp.seconds * 1000) // Convert seconds to milliseconds
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export function isValidImage(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false)
      return
    }

    const img = new Image()

    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}
