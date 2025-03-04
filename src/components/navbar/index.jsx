import { AppShell, Avatar, Burger, Button, Group, Title, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate, NavLink as RouterNavLink } from 'react-router-dom'
import { useAuth } from '../../providers/auth_provider'

function NavItem({ label, path, disabled }) {
  return (
    <RouterNavLink to={disabled ? null : path} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <Button disabled={disabled} variant={isActive ? 'light' : 'subtle'} size="compact-lg">
          {label}
        </Button>
      )}
    </RouterNavLink>
  )
}

export default function Navbar() {
  const [opened, { toggle }] = useDisclosure()
  const navigate = useNavigate()
  const { isAdmin, currentUser } = useAuth()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <UnstyledButton onClick={() => navigate('/')}>
              <Title order={2}>BeanVault</Title>
            </UnstyledButton>

            <Group ml="xl" gap={10} visibleFrom="sm">
              <NavItem path="/coffees" label="Coffees" />
              <NavItem disabled={!isAdmin} path="/admin" label="Admin" />
              <Avatar color="initials" name={currentUser?.email} />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Button variant="outline" onClick={() => navigate('/coffee')}>
          Coffee
        </Button>
        <Button variant="outline" onClick={() => navigate('/admin')}>
          Admin
        </Button>

      </AppShell.Navbar>
    </AppShell>
  )
}
