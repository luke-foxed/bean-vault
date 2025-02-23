export function formatFirestoreTimestamp(timestamp) {
  const date = new Date(timestamp.seconds * 1000) // Convert seconds to milliseconds
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}
