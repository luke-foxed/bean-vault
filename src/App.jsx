import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import { AuthProvider, useAuth } from './providers/auth_provider'
import { Signup } from './pages/signup'
import { Home } from './pages/home'
import { Login } from './pages/login'

export default function App() {
  return (
    <AuthProvider>
      <MantineProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/singup" element={<Signup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </MantineProvider>
    </AuthProvider>
  )
}

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth()

  // Show a loading state while checking authentication
  if (loading) return <div>Loading...</div>

  return currentUser ? children : <Navigate to="/login" />
}
