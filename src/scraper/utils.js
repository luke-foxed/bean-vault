import { firebaseAddCoffee } from '../firebase/api/coffee'
import { firebaseFetchRegions } from '../firebase/api/coffee'
import { firebaseFetchRoaster } from '../firebase/api/roasters'

export const prepareScrapedCoffeesForPreview = async (products, roasterId) => {
  const [regions, roaster] = await Promise.all([firebaseFetchRegions(), firebaseFetchRoaster(roasterId)])

  const regionMap = Object.fromEntries(regions.map((region) => [region.name.toLowerCase(), region]))
  const preparedProducts = products.map((product) => {

    // Transform regions to match the required format
    const regions = product.region?.map((regionName) => {
      const region = regionMap[regionName.toLowerCase()]
      return { name: region?.name || regionName, color: region?.color || 'gray' }
    }) || [{ name: 'Unknown', color: 'gray' }]

    return {
      id: crypto.randomUUID(),
      name: product.name,
      about: product.description,
      roaster: { id: roasterId, name: roaster?.name || 'Unknown Roaster' },
      regions,
      image: product.image,
      score: 1,
      tasting_notes: product.tasting_notes,
    }
  })

  return preparedProducts
}

export const writeScrapedCoffeToDB = async (roasterID, products) => {
  const regions = await firebaseFetchRegions()
  const regionMap = Object.fromEntries(regions.map((region) => [region.name.toLowerCase(), region]))

  const addCoffeePromises = products.map((product) => {

    const transformedProduct = {
      name: product.name,
      roaster: roasterID,
      regions: product.regions.map((region) => regionMap[region.name.toLowerCase()]?.id).filter(Boolean),
      image: product.image,
      score: 1, // giving this 1 for now so I can identify scraped coffees
      about: product.about,
      flavour_notes: product.tasting_notes || [],
    }

    return firebaseAddCoffee(transformedProduct)
  })

  const results = await Promise.all(addCoffeePromises)

  if (results.some((result) => !result.res)) throw new Error('Failed to add some coffees')

  return results.map((result) => result.res)
}
