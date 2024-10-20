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
import { useContext } from 'react'
import useUser from '../hooks/use_user'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/

export function Signup() {
  const { signUp } = useUser()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { password: '', email: '' },
    validate: {
      email: (value) => (!EMAIL_REGEX.test(value) ? 'Email is invalid' : null),
      password: (value) => !PASSWORD_REGEX.test(value) ? 'Password must be at least 8 characters and contain one number and special character' : null,
    },
  })

  const handleSubmit = async ({ email, password }) => {
    await signUp(email, password)
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
            Sign Up
          </Button>
        </Paper>
      </form>
    </Container>
  )
}
