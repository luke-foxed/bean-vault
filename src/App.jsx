import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { Alert, createTheme, LoadingOverlay, MantineProvider, Paper } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './providers/auth_provider'
import { NotifcationProvider, notify } from './providers/notifcation_provider'
import Signup from './pages/signup'
import Login from './pages/login'
import Home from './pages/home'
import Navbar from './components/navbar'
import Admin from './pages/admin'
import AdminUsers from './pages/admin/admin_users'
import AdminCoffees from './pages/admin/admin_coffees'

import Coffees from './pages/coffees'
import CoffeeEditor from './pages/coffees/coffee_editor'

const theme = createTheme({
  fontFamily: 'Gowun Dodum, sans-serif',
  headings: { fontFamily: 'Gowun Dodum, sans-serif' },
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (err) => notify('error', 'There was an error with your request', err?.message ?? 'Unknown Error'),
    },
    mutations: {
      retry: 1,
      onError: (err) => notify('error', 'There was an error with your request', err?.message ?? 'Unknown Error'),
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

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route index element={<Home />} />
          <Route path="/coffees" element={<Coffees />} />
        </Route>

        <Route element={<PrivateRoute adminRoute />}>
          <Route path="/coffee/new" element={<CoffeeEditor />} />
          <Route path="/coffee/edit/:id" element={<CoffeeEditor />} />
          <Route path="/admin" element={<Admin />}>
            <Route path="coffee" element={<AdminCoffees />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

function PrivateRoute({ adminRoute = false }) {
  const { currentUser, isAdmin, loading } = useAuth()

  if (loading) return <LoadingOverlay overlayProps={{ color: '#000' }} />

  if (!currentUser) return <Navigate to="/login" />

  return (
    <PrivateLayout>
      {(adminRoute && isAdmin) || !adminRoute ? (
        <Outlet />
      ) : (
        <Paper mt={200} p="20px" shadow="md" radius="lg">
          <Alert variant="light" color="yellow" radius="lg" title="Access Restricted" icon={<IconInfoCircle />}>
            Only admins can add new coffee :)
          </Alert>
        </Paper>
      )}
    </PrivateLayout>
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
