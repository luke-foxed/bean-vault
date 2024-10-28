import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Button,
  rem,
  Center,
  Stack,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth } from '../../providers/auth_provider'
import { useNavigate } from 'react-router-dom'
import { IconAt, IconLockOpen } from '@tabler/icons-react'
import './style.module.css'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/

export default function Signup() {
  const { signup, currentUser } = useAuth()
  const navigate = useNavigate()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { password: '', email: '' },
    validate: {
      email: (value) => (!EMAIL_REGEX.test(value) ? 'Email is invalid' : null),
      password: (value) =>
        !PASSWORD_REGEX.test(value)
          ? 'Password must be at least 8 characters and contain one number and special character'
          : null,
    },
  })

  if (currentUser) navigate('/')

  const handleSubmit = async ({ email, password }) => {
    await signup(email, password)
  }

  return (
    <Center style={{ height: '100vh' }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Title ta="center">Welcome to BeanVault!</Title>

        <Paper shadow="md" p={30} radius="lg">
          <Stack gap={10}>
            <TextInput
              radius="lg"
              label="Email"
              placeholder="you@email.com"
              required
              key={form.key('email')}
              leftSection={
                <IconAt style={{ width: rem(18), height: rem(18) }} />
              }
              {...form.getInputProps('email')}
            />
            <PasswordInput
              radius="lg"
              label="Password"
              placeholder="Your password"
              required
              key={form.key('password')}
              leftSection={
                <IconLockOpen style={{ width: rem(18), height: rem(18) }} />
              }
              {...form.getInputProps('password')}
            />
            <Button fullWidth type="submit" variant="light">
              Sign Up
            </Button>
          </Stack>
        </Paper>
      </form>
    </Center>
  )
}
