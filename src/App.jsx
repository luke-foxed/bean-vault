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
import Coffee from './pages/coffee'
import { QueryClient, QueryClientProvider } from 'react-query'
import Admin from './pages/admin'
import AdminCoffees from './pages/admin/admin_coffees'
import AdminUsers from './pages/admin/admin_users'

const theme = createTheme({
  fontFamily: 'Gowun Dodum, sans-serif',
  headings: { fontFamily: 'Gowun Dodum, sans-serif' },
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <NotifcationProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <AppRouter />
          </QueryClientProvider>
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
        {/* private routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/coffee"
          element={
            <PrivateRoute>
              <Coffee />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        >
          <Route path="coffee" element={<AdminCoffees />} />
          <Route path="users" element={<AdminUsers />} />
          <Route index element={<AdminCoffees />} />
        </Route>
      </Routes>
    </Router>
  )
}

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return currentUser ? (
    <PrivateLayout>{children}</PrivateLayout>
  ) : (
    <Navigate to="/login" />
  )
}

function PrivateLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
