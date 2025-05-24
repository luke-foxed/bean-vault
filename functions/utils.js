/* eslint-disable max-len */
const MAX_INPUT_LENGTHS = {
  name: 100,
  about: 1200,
  region: 50,
  flavourNote: 30,
}

module.exports.validateResponse = (response) => {
  if (!response || !response.choices?.[0]?.message?.content) {
    throw new Error('Invalid AI response format')
  }
  return response.choices[0].message.content
}

// sanatize the shit out of the input so people don't misuse my openai token and cost me a fortune :(
module.exports.sanitizeInput = (coffee) => {
  if (!coffee || typeof coffee !== 'object') throw new Error('Invalid input: coffee object is required')
  if (!coffee.name || !coffee.about) throw new Error('Invalid input: name and about are required')
  if (coffee.name.length > MAX_INPUT_LENGTHS.name) throw new Error(`Name must be less than ${MAX_INPUT_LENGTHS.name} characters, received ${coffee.name}`)
  if (coffee.about.length > MAX_INPUT_LENGTHS.about) throw new Error(`About must be less than ${MAX_INPUT_LENGTHS.about} characters, received ${coffee.about}`)
  if (!Array.isArray(coffee.regions)) throw new Error(`Invalid input: regions must be an array, received type ${typeof coffee.regions}`)
  if (!Array.isArray(coffee.flavour_notes)) throw new Error(`Invalid input: flavour_notes must be an array, received type ${typeof coffee.flavour_notes}`)

  const sanitizedRegions = coffee.regions.map((region) => {
    if (typeof region.name !== 'string' || region.name.length > MAX_INPUT_LENGTHS.region) {
      throw new Error(`Invalid region name: must be a string less than ${MAX_INPUT_LENGTHS.region} characters, received ${region.name}`)
    }
    return { name: region.name.trim() }
  })

  const sanitizedNotes = coffee.flavour_notes.map((note) => {
    if (typeof note !== 'string' || note.length > MAX_INPUT_LENGTHS.flavourNote) {
      throw new Error(`Invalid flavour note: must be a string less than ${MAX_INPUT_LENGTHS.flavourNote} characters, received ${note}`)
    }
    return note.trim()
  })

  return {
    name: coffee.name.trim(),
    about: coffee.about.trim(),
    regions: sanitizedRegions,
    flavour_notes: sanitizedNotes,
  }
}