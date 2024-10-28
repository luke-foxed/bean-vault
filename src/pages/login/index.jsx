import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Button,
  rem,
  Center,
  Stack,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth } from '../../providers/auth_provider'
import { Link, useNavigate } from 'react-router-dom'
import { IconAt, IconBrandGoogle, IconLockOpen } from '@tabler/icons-react'
import './style.module.css'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/

export default function Login() {
  const { login, loginWithGoogle, currentUser } = useAuth()
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
    await login(email, password)
  }

  const handleClickGoogle = async () => {
    await loginWithGoogle()
  }

  return (
    <Center style={{ height: '100vh' }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Title ta="center">BeanVault</Title>
        <Paper shadow="md" p={30} radius="lg" w={400}>
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
              Log In
            </Button>
            <Text ta="center" c="dimmed">
              OR
            </Text>
            <Button
              onClick={handleClickGoogle}
              fullWidth
              leftSection={
                <IconBrandGoogle style={{ width: rem(18), height: rem(18) }} />
              }
              variant="light"
              color="rgba(240, 91, 91, 1)"
            >
              Login With Google
            </Button>
            <Text ta="center" c="dimmed">
              Don&apos;t have an account?{' '}
              <Text span c="blue">
                <Link
                  to="/signup"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Sign Up
                </Link>
              </Text>
            </Text>
          </Stack>
        </Paper>
      </form>
    </Center>
  )
}
