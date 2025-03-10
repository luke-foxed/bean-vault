import { AppShell, Avatar, Box, Burger, Button, Group, Image, Stack, Title, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate, NavLink as RouterNavLink } from 'react-router-dom'
import { useAuth } from '../../providers/auth_provider'

function NavItem({ label, path, disabled, onClick = () => {} }) {
  return (
    <RouterNavLink to={disabled ? null : path} style={{ textDecoration: 'none', margin: 'auto' }}>
      {({ isActive }) => (
        <Box
          pos="relative"
          ta="center"
        >
          <Button
            onClick={onClick}
            disabled={disabled}
            color={isActive ? 'blue' : 'dark'}
            size="compact-lg"
            w="100"
            style={{ fontSize: '20px' }}
            variant="subtle"
          >
            {label}
          </Button>

          {isActive && !disabled && (
            <Box
              pos="absolute"
              bottom={-8}
              left="50%"
              w="100%"
              h={3}
              bg="blue.6"
              style={{ transform: 'translateX(-50%)', borderRadius: 2 }}
            />
          )}
        </Box>
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
      header={{ height: 70 }}
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
              <Group>
                <Image src={'/logo2.png'} h={50} />
                <Title order={1}>BeanVault</Title>
              </Group>
            </UnstyledButton>

            <Group ml="xl" gap={20} visibleFrom="sm">
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
          <NavItem path="/coffees" label="Coffees" onClick={toggle} />
          <NavItem disabled={!isAdmin} path="/admin" label="Admin" onClick={toggle} />
        </Stack>
      </AppShell.Navbar>
    </AppShell>
  )
}
