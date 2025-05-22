import { hasLength, isInRange, isNotEmpty } from '@mantine/form'

const isValidURL = (value) => {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

const newCoffeeForm = {
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    image: '',
    roaster: '',
    regions: [],
    about: '',
    flavour_notes: [],
    score: 5,
  },

  validate: {
    name: hasLength({ min: 3 }, 'Name must have a minimum of 3 characters'),
    roaster: isNotEmpty('Enter the roaster'),
    regions: isNotEmpty('Enter the coffee origin'),
    score: isInRange({ min: 1, max: 10 }, 'Score must be between 1 and 10'),
    flavour_notes: isNotEmpty('Enter a flavour notes'),
    about: hasLength({ min: 10 }, 'About section must have a minimum of 10 characters'),
    image: (value) => {
      if (!value) return 'Enter an image file or URL'
      if (value instanceof File) return null
      if (typeof value === 'string' && !isValidURL(value)) return 'Enter a valid image URL'
    },
  },
}

export default newCoffeeForm
