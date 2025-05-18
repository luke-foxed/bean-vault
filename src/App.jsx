import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { Alert, createTheme, LoadingOverlay, MantineProvider, Paper, Title } from '@mantine/core'
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
import AdminScraper from './pages/admin/admin_scraper'

import Coffees from './pages/coffees'
import CoffeeEditor from './pages/coffees/coffee_editor'
import Roasters from './pages/roasters'
import AdminRoasters from './pages/admin/admin_roasters'
import RoasterEditor from './pages/roasters/roaster_editor'
import { ModalsProvider } from '@mantine/modals'

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
      <ModalsProvider>
        <div className="mantine-color-scheme-transition">
          <NotifcationProvider>
            <AuthProvider>
              <QueryClientProvider client={queryClient}>
                <AppRouter />
              </QueryClientProvider>
            </AuthProvider>
          </NotifcationProvider>
        </div>
      </ModalsProvider>
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
          <Route path="/roasters" element={<Roasters />} />
        </Route>

        {/* Admin routes */}
        <Route element={<PrivateRoute adminRoute />}>
          <Route path="/coffee/new" element={<CoffeeEditor />} />
          <Route path="/coffee/edit/:id" element={<CoffeeEditor />} />

          <Route path="/roaster/new" element={<RoasterEditor />} />
          <Route path="/roaster/edit/:id" element={<RoasterEditor />} />

          <Route path="/admin" element={<Admin />}>
            <Route path="coffee" element={<AdminCoffees />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="roasters" element={<AdminRoasters />} />
            <Route path="scraper" element={<AdminScraper />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

function PrivateRoute({ adminRoute = false }) {
  const { currentUser, isAdmin, isBlocked, loading } = useAuth()

  let ContentComponent = <Outlet />

  if (loading) return <LoadingOverlay overlayProps={{ color: '#000' }} />

  if (!currentUser) return <Navigate to="/login" />

  if ((adminRoute && !isAdmin) || isBlocked) {
    ContentComponent = (
      <Paper mt={200} p="20px" shadow="md" radius="lg" w="75%" m="150 auto">
        <Alert
          variant="light"
          color="yellow"
          radius="lg"
          title={<Title order={3}>Access Restricted</Title>}
          icon={<IconInfoCircle />}
        >
          <Title order={4}>
            {isBlocked
              ? 'Your account has been created but not yet approved to access this app'
              : 'This page can only be accessed by admin users'}
          </Title>
        </Alert>
      </Paper>
    )
  }

  return (
    <PrivateLayout>
      {ContentComponent}
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
