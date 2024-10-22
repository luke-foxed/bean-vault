import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { createTheme, MantineProvider } from '@mantine/core'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import { AuthProvider, useAuth } from './providers/auth_provider'
import Signup from './pages/signup'
import Login from './pages/login'
import Home from './pages/home'
import { NotifcationProvider } from './providers/notifcation_provider'
import Navbar from './components/navbar'

const theme = createTheme({
  fontFamily: 'Gowun Dodum, sans-serif',
  headings: { fontFamily: 'Gowun Dodum, sans-serif' },
})

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <NotifcationProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </NotifcationProvider>
    </MantineProvider>
  )
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navbar />
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth()

  // Show a loading state while checking authentication
  if (loading) return <div>Loading...</div>

  return currentUser ? children : <Navigate to="/login" />
}
