import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import useUser from './hooks/use_user'
import { Signup } from './pages/signup'
import AuthProvider from './context/auth_provider'

export default function App() {
  const { user } = useUser()
  return (
    <MantineProvider>
      <AuthProvider>{user ? <h1>Welcome Back</h1> : <Signup />}</AuthProvider>
    </MantineProvider>
  )
}
