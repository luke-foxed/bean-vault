const LISTING_PROMPT = `
  Go through all listings on this page. For every coffee bean, retrieve the URL of the product page. Return the URLs in a JSON array.
  Do not retrieve URLs of pages that are not for coffee beans.
  Ignore any 'You may also like', 'Related products', or similar sections.
  Only include URLs from the main product listing section.
`

const PRODUCT_PROMPT = `
Extract coffee bean information from the page and return it as a JSON array. Follow these instructions carefully:

1. SCOPE:
   - Focus only on the main product section
   - Ignore 'You may also like' or 'related products' sections
   - Process all coffee beans listed on the page

2. REQUIRED FIELDS for each coffee bean:
   {
     "name": "string (in title case)",
     "description": "string",
     "roaster": "string",
     "region": ["string"], // Array of countries only
     "image": "string (full-size image URL, not thumbnail)",
     "tasting_notes": ["string"] // Max 5 food-related notes
   }

3. DATA PROCESSING RULES:
   - Convert any uppercase text to title case for: name, region, description
   - For regions: extract only country names, store as array of strings
   - For tasting notes: prioritize food-related notes, limit to 5 maximum
   - For images: use full-size product image URL, not the listing thumbnail

4. ERROR HANDLING:
   - If region is not found on first attempt, try a second time
   - If any field cannot be found, include it as null in the JSON

5. OUTPUT FORMAT:
   - Return a JSON array of objects
   - Each object must contain all specified fields
   - Maintain consistent structure across all entries
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
