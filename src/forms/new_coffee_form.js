import { hasLength, isInRange, isNotEmpty } from '@mantine/form'

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
    image: isNotEmpty('Enter an image file'),
  },
}

export default newCoffeeForm
