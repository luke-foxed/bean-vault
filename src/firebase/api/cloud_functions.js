/* eslint-disable no-useless-catch */

export const optimizeCoffeeDescription = async (coffee) => {
  try {
    const { getFunctions, httpsCallable } = await import('firebase/functions')
    const functions = getFunctions()
    const optimizeDescription = httpsCallable(functions, 'optimizeCoffeeDescription')
    const result = await optimizeDescription({ coffee })
    return result.data.optimizedDescription
  } catch (error) {
    throw error
  }
}

// will come later
export const scrapeCoffees = async () => {}
