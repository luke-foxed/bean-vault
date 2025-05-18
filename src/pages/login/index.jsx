import { TextInput, PasswordInput, Paper, Title, Text, Button, rem, Center, Stack, Divider } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth } from '../../providers/auth_provider'
import { Link, useNavigate } from 'react-router-dom'
import { IconAt, IconBrandGoogle, IconLockOpen } from '@tabler/icons-react'
import './style.module.css'
import loginForm from '../../forms/login_form'
import { useNotify } from '../../providers/notifcation_provider'

export default function Login() {
  const { login, loginWithGoogle, currentUser } = useAuth()
  const navigate = useNavigate()
  const form = useForm(loginForm)
  const { notify } = useNotify()
  if (currentUser) navigate('/')

  const handleSubmit = async ({ email, password }) => {
    try {
      await login(email, password)
    } catch (error) {
      notify('error', 'Login Failed', error.message)
    }
  }

  const handleClickGoogle = async () => {
    await loginWithGoogle()
  }

  return (
    <Center style={{ height: '100vh' }}>
      <Stack w={{ base: '95%', sm: 400 }}>
        <Title ta="center" order={1} ff="Unica One">
          BeanVault
        </Title>
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
            <Button size="compact-lg" fullWidth type="submit" variant="light" mt="md">
              Log In
            </Button>
            <Divider label="OR" my="md" variant="dashed" w="100%" />
            <Button
              size="compact-lg"
              onClick={handleClickGoogle}
              fullWidth
              leftSection={<IconBrandGoogle style={{ width: rem(18), height: rem(18) }} />}
              variant="light"
              color="red"
            >
              Login With Google
            </Button>
            <Text ta="center" c="dimmed" mt="md">
              Don&apos;t have an account?{' '}
              <Text span c="blue">
                <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Sign Up
                </Link>
              </Text>
            </Text>
          </form>
        </Paper>
      </Stack>
    </Center>
  )
}
