import { AppShell, Box, Burger, Button, Group, Image, Stack, Text, UnstyledButton, useMantineColorScheme } from '@mantine/core'
import { useDisclosure, useHover } from '@mantine/hooks'
import { useNavigate, NavLink as RouterNavLink } from 'react-router-dom'
import { useAuth } from '../../providers/auth_provider'
import User from './user'

function NavItem({ label, path, disabled, onClick = () => {} }) {
  const { hovered, ref } = useHover()
  return (
    <RouterNavLink to={disabled ? null : path} style={{ textDecoration: 'none', margin: 'auto' }}>
      {({ isActive }) => (
        <Box
          pos="relative"
          ta="center"
          ref={ref}
        >
          <Button
            onClick={onClick}
            disabled={disabled}
            color={(isActive || (hovered && !isActive)) && !disabled ? 'blue' : 'dark'}
            size="compact-lg"
            w="100"
            style={{ fontSize: '20px' }}
            variant="subtle"
          >
            {label}
          </Button>

          {(isActive && !disabled) && (
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
  const [navOpened, { toggle: toggleNav }] = useDisclosure()
  const navigate = useNavigate()
  const { isAdmin, currentUser } = useAuth()
  const { colorScheme } = useMantineColorScheme()

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !navOpened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={navOpened} onClick={toggleNav} hiddenFrom="sm" size="sm" />

          <Group visibleFrom="sm" style={{ flex: 1 }} justify="space-between">
            <UnstyledButton onClick={() => navigate('/')}>
              <Group>
                <Image src={`/logo_${colorScheme === 'dark' ? 'light' : 'dark'}.png`} h={50} />
                <Text ff="Unica One" size="50px">
                  BeanVault
                </Text>
              </Group>
            </UnstyledButton>
            <Group gap={20}>
              <NavItem path="/coffees" label="Coffees" />
              <NavItem path="/roasters" label="Roasters" />
              <NavItem disabled={!isAdmin} path="/admin/coffee" label="Admin" />
              <User key="desktop" />
            </Group>
          </Group>

          <UnstyledButton
            onClick={() => navigate('/')}
            hiddenFrom="sm"
            style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
          >
            <Image src={`/logo_${colorScheme === 'dark' ? 'light' : 'dark'}.png`} h={50} />
          </UnstyledButton>

          <Box hiddenFrom="sm">
            <User currentUser={currentUser} />
          </Box>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md">
        <Stack align="center">
          <Text ff="Unica One" size="50px">
            BeanVault
          </Text>

          <NavItem path="/" label="Home" onClick={toggleNav} />
          <NavItem path="/coffees" label="Coffees" onClick={toggleNav} />
          <NavItem path="/roasters" label="Roasters" onClick={toggleNav} />
          <NavItem disabled={!isAdmin} path="/admin/coffee" label="Admin" onClick={toggleNav} />
        </Stack>
      </AppShell.Navbar>
    </AppShell>
  )
}
