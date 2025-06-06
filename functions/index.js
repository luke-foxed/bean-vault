/* eslint-disable max-len */

const { defineSecret } = require('firebase-functions/params')
const { onCall } = require('firebase-functions/v2/https')
const { OpenAI } = require('openai')
const { validateResponse, sanitizeInput } = require('./utils')
const { COFFEE_DESCRIPTION_SYSTEM_PROMPT, COFFEE_DESCRIPTION_INSTRUCTIONS, COFFEE_BREW_TIPS_SYSTEM_PROMPT, COFFEE_BREW_TIPS_INSTRUCTIONS } = require('./constants')
const openaiApiKey = defineSecret('OPENAI_API_KEY')

/**
 * Optimizes a coffee description using OpenAI's GPT-3.5-turbo model.
 * @param {Object} request - The request object containing the coffee data.
 * @param {Object} request.data - The coffee data.
 * @param {Object} request.auth - The authentication object.
 * @returns {Promise<Object>} The optimized coffee description.
 */
exports.optimizeCoffeeDescription = onCall({ maxInstances: 10, secrets: [openaiApiKey] }, async (request) => {
  if (!request.auth) throw new Error('Must be authenticated to use this function')

  try {
    const sanitizedCoffee = sanitizeInput(request.data.coffee)

    const client = new OpenAI({ apiKey: openaiApiKey.value() })

    const input = `
      Coffee Details:
        - Name: ${sanitizedCoffee.name}
        - Origin: ${sanitizedCoffee.regions.map((r) => r.name).join(', ')}
        - Flavor Notes: ${sanitizedCoffee.flavour_notes.join(', ')}
        - Current Description: ${sanitizedCoffee.about}
    `

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: COFFEE_DESCRIPTION_SYSTEM_PROMPT },
        { role: 'user', content: `${COFFEE_DESCRIPTION_INSTRUCTIONS}\n\n${input}` },
      ],
    })

    const validatedResponse = validateResponse(response)

    return { optimizedDescription: validatedResponse }
  } catch (error) {
    console.error('Error optimizing description:', error)
    throw new Error('Failed to optimize coffee description. Please try again later.')
  }
})

/**
 * Generates coffee brew tips using OpenAI's GPT-3.5-turbo model.
 * @param {Object} request - The request object containing the coffee data.
 * @param {Object} request.data - The coffee data.
 * @param {Object} request.auth - The authentication object.
 * @returns {Promise<Object>} The generated coffee brew tips.
 */
exports.generateCoffeeBrewTips = onCall({ maxInstances: 10, secrets: [openaiApiKey] }, async (request) => {
  if (!request.auth) throw new Error('Must be authenticated to use this function')
  try {
    const sanitizedCoffee = sanitizeInput(request.data.coffee)

    const client = new OpenAI({ apiKey: openaiApiKey.value() })

    const input = `
      Coffee Details:
        - Name: ${sanitizedCoffee.name}
        - Origin: ${sanitizedCoffee.regions.map((r) => r.name).join(', ')}
        - Flavor Notes: ${sanitizedCoffee.flavour_notes.join(', ')}
        - Current Description: ${sanitizedCoffee.about}
    `

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: COFFEE_BREW_TIPS_SYSTEM_PROMPT },
        { role: 'user', content: `${COFFEE_BREW_TIPS_INSTRUCTIONS}\n\n${input}` },
      ],
    })

    const validatedResponse = validateResponse(response)

    return { brewTips: validatedResponse }
  } catch (error) {
    console.error('Error generating coffee brew tips:', error)
    throw new Error('Failed to generate coffee brew tips. Please try again later.')
  }
})
