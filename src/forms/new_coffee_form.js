import { hasLength, isInRange, isNotEmpty, matches } from '@mantine/form'

const URL_REGEX = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-.]*)*\/?$/

const newCoffeeForm = {
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    image: '',
    roaster: '',
    regions: [],
    notes: [],
    score: 5,
  },

  validate: {
    name: hasLength({ min: 2 }, 'Name must have a minimum of 3 characters'),
    roaster: isNotEmpty('Enter the roaster'),
    regions: isNotEmpty('Enter the coffee origin'),
    score: isInRange({ min: 1, max: 10 }, 'Score must be between 1 and 10'),
    image: matches(URL_REGEX, 'Image must be a valid URL'),
  },
}

export default newCoffeeForm
