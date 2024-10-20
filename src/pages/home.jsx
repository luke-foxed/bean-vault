import { useAuth } from '../providers/auth_provider'

export function Home() {
  const { currentUser } = useAuth()
  return <h1>Welcome back, {currentUser.email} </h1>
}
