import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth } from '../providers/auth_provider'
import { useNavigate } from 'react-router-dom'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/

export function Login() {
  const { login, currentUser } = useAuth()
  const navigate = useNavigate()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { password: '', email: '' },
    validate: {
      email: (value) => (!EMAIL_REGEX.test(value) ? 'Email is invalid' : null),
      password: (value) => !PASSWORD_REGEX.test(value) ? 'Password must be at least 8 characters and contain one number and special character' : null,
    },
  })

  if (currentUser) navigate('/')

  const handleSubmit = async ({ email, password }) => {
    await login(email, password)
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome to BeanVault!</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <Button fullWidth type="submit" mt="md">
            Log In
          </Button>
        </Paper>
      </form>
    </Container>
  )
}
