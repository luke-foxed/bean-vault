import { getFunctions, httpsCallable } from 'firebase/functions'
import { firebaseFetchRegionsByIds } from './regions'
import { firebaseFetchCurrentUser } from './auth'

const functions = (() => {
  const functions = getFunctions()
  return functions
})()

const optimizeDescription = httpsCallable(functions, 'optimizeCoffeeDescription')
const generateBrewTips = httpsCallable(functions, 'generateCoffeeBrewTips')

export const optimizeCoffeeDescription = async (coffee) => {
  try {
    // fetch the region as a name
    const regions = await firebaseFetchRegionsByIds(coffee.regions)
    return await authWrappedRequest(optimizeDescription, { coffee: { ...coffee, regions } })
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw new Error('Error optimizing coffee description')
  }
}

export const generateCoffeeBrewTips = async (coffee) => {
  try {
    const regions = await firebaseFetchRegionsByIds(coffee.regions)
    return authWrappedRequest(generateBrewTips, { coffee: { ...coffee, regions } })
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw new Error('Error generating coffee brew tips')
  }
}

const authWrappedRequest = async (fn, ...args) => {
  const user = await firebaseFetchCurrentUser()

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) throw new Error('You are not permitted to use this feature')

  const result = await fn(...args)
  return result.data
}

// will come later
export const scrapeCoffees = async () => {}
