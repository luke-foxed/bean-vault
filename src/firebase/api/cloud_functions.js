import { getFunctions, httpsCallable } from 'firebase/functions'
import { firebaseFetchRegionsByIds } from './regions'

const functions = (() => {
  const functions = getFunctions()
  return functions
})()

const optimizeDescription = httpsCallable(functions, 'optimizeCoffeeDescription')

export const optimizeCoffeeDescription = async (coffee) => {
  try {
    // fetch the region as a name
    const regions = await firebaseFetchRegionsByIds(coffee.regions)
    const result = await optimizeDescription({ coffee: { ...coffee, regions } })
    return result.data.optimizedDescription
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw new Error('Error optimizing coffee description')
  }
}

// will come later
export const scrapeCoffees = async () => {}
