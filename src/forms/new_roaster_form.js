import { hasLength, isNotEmpty } from '@mantine/form'

const newCoffeeForm = {
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    image: '',
    location: '',
    website: '',
    about: '',
  },

  validate: {
    name: hasLength({ min: 3 }, 'Name must have a minimum of 3 characters'),
    location: isNotEmpty('Enter the roaster location'),
    website: isNotEmpty('Enter the roaster website'),
    image: isNotEmpty('Enter an image file'),
    about: isNotEmpty('Enter information about the roaster'),
  },
}

export default newCoffeeForm
