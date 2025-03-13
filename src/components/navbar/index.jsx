import { AppShell, Box, Burger, Button, Group, Image, Stack, Text, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate, NavLink as RouterNavLink } from 'react-router-dom'
import { useAuth } from '../../providers/auth_provider'
import User from './user'

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
  const [userPopoverOpened, { toggle: toggleUserPopover }] = useDisclosure()
  const [mobileUserPopoverOpened, { toggle: toggleMobileUserPopover }] = useDisclosure()
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
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

          <Group visibleFrom="sm" style={{ flex: 1 }} justify="space-between">
            <UnstyledButton onClick={() => navigate('/')}>
              <Group>
                <Image src="/logo_black.png" h={50} />
                <Text ff="Unica One" size="50px">
                  BeanVault
                </Text>
              </Group>
            </UnstyledButton>
            <Group gap={20}>
              <NavItem path="/coffees" label="Coffees" />
              <NavItem disabled={!isAdmin} path="/admin" label="Admin" />
              <User key="desktop" currentUser={currentUser} opened={userPopoverOpened} toggle={toggleUserPopover} />
            </Group>
          </Group>

          <UnstyledButton
            onClick={() => navigate('/')}
            hiddenFrom="sm"
            style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
          >
            <Image src="/logo_black.png" h={50} />
          </UnstyledButton>

          <Box hiddenFrom="sm">
            <User currentUser={currentUser} opened={mobileUserPopoverOpened} toggle={toggleMobileUserPopover} />
          </Box>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md">
        <Stack align="center">
          <Text ff="Unica One" size="50px">
            BeanVault
          </Text>

          <NavItem path="/" label="Home" onClick={toggle} />
          <NavItem path="/coffees" label="Coffees" onClick={toggle} />
          <NavItem disabled={!isAdmin} path="/admin" label="Admin" onClick={toggle} />
        </Stack>
      </AppShell.Navbar>
    </AppShell>
  )
}
