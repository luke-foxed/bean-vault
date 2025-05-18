const LISTING_PROMPT = `
  Go through all listings on this page. For every coffee bean, retrieve the URL of the product page. Return the URLs in a JSON array.
  Do not retrieve URLs of pages that are not for coffee beans.
  Ignore any 'You may also like', 'Related products', or similar sections.
  Only include URLs from the main product listing section.
`

const PRODUCT_PROMPT = `
  Go through all coffee beans listed on the page. For each bean, extract the following information: name, description,roaster, region, the image url, and 
  tasting notes. Return the information in a JSON array. Regions should be country only, where each country is a string in the array. Ignore the 
  'You may also like' or anything similar to a 'related products' section for each page. Only extract information from the main product section of the 
  page. Flavour notes should be kept to 5 at max, looking for food related notes mainly. 
  
  Each JSON object should have the following fields: name, description, roaster, region (array of strings), image, tasting_notes (array of strings).
`

const makeScrapeRequest = async (url, prompt) => {
  const fetchConfig = { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  return fetch(`/api/scrape/${encodeURIComponent(url)}?q=${encodeURIComponent(prompt)}`, fetchConfig)
}

const scrapeListing = async (url) => {
  const response = await makeScrapeRequest(url, LISTING_PROMPT)
  const text = await response.text()
  return parseLLMResponse(text)
}

const scrapeProduct = async (url) => {
  const response = await makeScrapeRequest(url, PRODUCT_PROMPT)
  const text = await response.text()
  return parseLLMResponse(text)
}

const parseLLMResponse = (text) => {
  try {
    const response = JSON.parse(text)
    const answer = response.answer

    // Remove the markdown code block markers and parse the inner JSON
    const jsonStr = answer.replace(/```json\n|\n```/g, '')
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error('Error parsing LLM response:', error)
    console.error('Raw response:', text)
    throw error
  }
}

export const scrapeAllProducts = async (roasterID, listingURL, onProgress = () => {}) => {
  try {
    // First get all product URLs from the listing page
    onProgress({ type: 'init', message: 'Fetching product URLs...' })
    const productURLs = await scrapeListing(listingURL)

    console.debug('Found product URLs:', productURLs)

    // Keep track of processed products to avoid duplicates
    const processedProducts = new Map()
    const products = []

    for (let i = 0; i < productURLs.length; i++) {
      const url = productURLs[i]
      // Skip if we've already processed this URL
      if (processedProducts.has(url)) {
        console.debug('Skipping duplicate URL:', url)
        onProgress({ type: 'skip', url, index: i })
        continue
      }

      onProgress({ type: 'start', url, index: i })
      const productData = await scrapeProduct(url)

      // Process each product and check for duplicates by name
      for (const product of productData) {
        const key = product.name?.toLowerCase().trim()
        if (key && !processedProducts.has(key)) {
          processedProducts.set(key, true)

          if (!product?.region?.length) product.region = ['unknown']
          if (!product?.tasting_notes?.length) product.tasting_notes = ['unknown']

          products.push(product)
        } else {
          console.debug('Skipping duplicate product:', product.name)
        }
      }
      onProgress({ type: 'complete', url, index: i })
    }

    onProgress({ type: 'done', message: 'Scraping completed!' })
    return products
  } catch (error) {
    console.error('Error during scraping:', error)
    onProgress({ type: 'error', message: error.message })
    throw error
  }
}
