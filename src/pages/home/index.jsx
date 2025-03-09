import { Button, Center, Stack } from '@mantine/core'
import { useAuth } from '../../providers/auth_provider'

export default function Home() {
  const { currentUser, logout } = useAuth()

  const handleClickLogout = async () => {
    await logout()
  }

  return (
    <Center mt={200}>
      <Stack>
        <h1>Welcome back, {currentUser.name} </h1>
        <Button onClick={handleClickLogout}>Logout</Button>
      </Stack>
    </Center>
  )
}
