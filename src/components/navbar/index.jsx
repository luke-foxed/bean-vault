import { AppShell, Burger, Group, Title, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from './style.module.css'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [opened, { toggle }] = useDisclosure()
  const navigate = useNavigate()

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

            <Group ml="xl" gap={0} visibleFrom="sm">
              <UnstyledButton
                onClick={() => navigate('/coffee')}
                className={classes.control}
              >
                Coffee
              </UnstyledButton>
              <UnstyledButton
                onClick={() => navigate('/admin')}
                className={classes.control}
              >
                Admin
              </UnstyledButton>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton
          onClick={() => navigate('/coffee')}
          className={classes.control}
        >
          Coffee
        </UnstyledButton>
        <UnstyledButton
          onClick={() => navigate('/admin')}
          className={classes.control}
        >
          Admin
        </UnstyledButton>
      </AppShell.Navbar>
    </AppShell>
  )
}
