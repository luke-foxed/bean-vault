import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Button,
  rem,
  Center,
  Stack,
  Text,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth } from '../../providers/auth_provider'
import { Link, useNavigate } from 'react-router-dom'
import { IconAt, IconLockOpen, IconUser } from '@tabler/icons-react'
import './style.module.css'
import signupForm from '../../forms/signup_form'

export default function Signup() {
  const { signup, currentUser } = useAuth()
  const navigate = useNavigate()
  const form = useForm(signupForm)

  if (currentUser) navigate('/')

  const handleSubmit = async (user) => {
    await signup(user)
  }

  return (
    <Center style={{ height: '100vh' }}>
      <Stack gap={10}>
        <Title ta="center">Welcome to BeanVault!</Title>
        <Paper shadow="md" p={30} radius="lg">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              radius="lg"
              label="Email"
              placeholder="you@email.com"
              required
              key={form.key('email')}
              leftSection={<IconAt style={{ width: rem(18), height: rem(18) }} />}
              {...form.getInputProps('email')}
            />
            <PasswordInput
              mt="md"
              radius="lg"
              label="Password"
              placeholder="Your password"
              required
              key={form.key('password')}
              leftSection={<IconLockOpen style={{ width: rem(18), height: rem(18) }} />}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              mt="md"
              radius="lg"
              label="Password"
              placeholder="Confirm password"
              required
              key={form.key('confirm_password')}
              leftSection={<IconLockOpen style={{ width: rem(18), height: rem(18) }} />}
              {...form.getInputProps('confirm_password')}
            />
            <TextInput
              mt="md"
              radius="lg"
              label="Name"
              placeholder="John Doe"
              required
              key={form.key('name')}
              leftSection={<IconUser style={{ width: rem(18), height: rem(18) }} />}
              {...form.getInputProps('name')}
            />
            <Button fullWidth type="submit" variant="light" mt="md">
              Sign Up
            </Button>
            <Text ta="center" c="dimmed" mt="md">
              Have an account?{' '}
              <Text span c="blue">
                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Log In
                </Link>
              </Text>
            </Text>
          </form>
        </Paper>
      </Stack>
    </Center>
  )
}
