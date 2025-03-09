import { AppShell, Avatar, Burger, Button, Group, Stack, Title, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate, NavLink as RouterNavLink } from 'react-router-dom'
import { useAuth } from '../../providers/auth_provider'

function NavItem({ label, path, disabled, width = 'min-content' }) {
  return (
    <RouterNavLink to={disabled ? null : path} style={{ textDecoration: 'none', width }}>
      {({ isActive }) => (
        <Button w={width} disabled={disabled} variant={isActive ? 'light' : 'white'} size="compact-lg">
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
              <Avatar color="initials" name={currentUser?.name} />
            </Group>
            <Group hiddenFrom="sm" ml="xl">
              <Avatar color="initials" name={currentUser?.name} />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md">
        <Stack align="center">
          <NavItem width="95%" path="/coffees" label="Coffees" />
          <NavItem width="95%" disabled={!isAdmin} path="/admin" label="Admin" />
        </Stack>
      </AppShell.Navbar>
    </AppShell>
  )
}
