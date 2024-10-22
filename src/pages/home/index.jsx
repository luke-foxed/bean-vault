import { Button, Center } from '@mantine/core'
import { useAuth } from '../../providers/auth_provider'

export default function Home() {
  const { currentUser, logout } = useAuth()

  const handleClickLogout = async () => {
    await logout()
  }

  return (
    <Center mt={200}>
      <h1>Welcome back, {currentUser.email} </h1>
      <Button onClick={handleClickLogout}>Logout</Button>
    </Center>
  )
}
