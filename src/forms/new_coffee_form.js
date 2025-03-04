import { hasLength, isInRange, isNotEmpty } from '@mantine/form'

const newCoffeeForm = {
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    image: '',
    roaster: '',
    regions: [],
    flavour_notes: [],
    additional_notes: '',
    score: 5,
  },

  validate: {
    name: hasLength({ min: 2 }, 'Name must have a minimum of 3 characters'),
    roaster: isNotEmpty('Enter the roaster'),
    regions: isNotEmpty('Enter the coffee origin'),
    score: isInRange({ min: 1, max: 10 }, 'Score must be between 1 and 10'),
    image: isNotEmpty('Enter the coffee image URL'),
  },
}

export default newCoffeeForm
