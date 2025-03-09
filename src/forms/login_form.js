import { isNotEmpty } from '@mantine/form'

const loginForm = {
  mode: 'uncontrolled',
  initialValues: { password: '', email: '' },
  validate: {
    email: isNotEmpty('Enter an email'),
    password: isNotEmpty('Enter a password'),
  },
}

export default loginForm
