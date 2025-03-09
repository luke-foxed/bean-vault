import { isNotEmpty, matches } from '@mantine/form'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/

const signupForm = {
  mode: 'uncontrolled',
  initialValues: { password: '', email: '' },
  validate: {
    name: isNotEmpty('Name cannot be empty'),
    email: matches(EMAIL_REGEX, 'Not a valid email'),
    password: matches(
      PASSWORD_REGEX,
      'Password must be at least 8 characters and contain one number and special character',
    ),
    confirm_password: (val, formValues) => val === formValues.password ? null : 'Passwords must be the same',
  },
}

export default signupForm
