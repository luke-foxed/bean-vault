import { Popover, Avatar, Button, Stack, Divider, Group, Text, useMantineColorScheme } from '@mantine/core'
import { useAuth } from '../../providers/auth_provider'
import RoleBadge from '../role_badge'
import ColorSchemeToggle from './color_scheme_toggle'
import { useHover } from '@mantine/hooks'
import { useNavigate } from 'react-router-dom'
import { IconList } from '@tabler/icons-react'

function User({ currentUser, toggle }) {
  const { logout } = useAuth()
  const { hovered, ref } = useHover()
  const { colorScheme } = useMantineColorScheme()
  const navigate = useNavigate()

  return (
    <Popover position="bottom-end" withArrow closeOnClickOutside={true} onClose={toggle} withinPortal={false}>
      <Popover.Target ref={ref}>
        <Button bg="transparent" p={0} h="100%">
          <Avatar
            style={{ cursor: 'pointer' }}
            // yeah nested ternary, fight me
            bg={hovered ? (colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent'}
            color="initials"
            name={currentUser?.name}
            onClick={toggle}
          />
        </Button>
      </Popover.Target>
      <Popover.Dropdown mt="10px" style={{ borderRadius: '10px' }} w="260px">
        <Stack justify="center" align="center" gap="15px">
          <RoleBadge name={currentUser?.name} role={currentUser?.role} />
          <Divider variant="dashed" w="100%" />
          <Group justify="space-between" w="100%">
            <Text c="dimmed">Toggle Theme</Text>
            <ColorSchemeToggle />
          </Group>
          <Button
            size="compact-sm"
            variant="light"
            leftSection={<IconList size={16} />}
            w="100%"
            onClick={() => {
              toggle()
              navigate(`/${currentUser.uid}/coffees`)
            }}
          >
            Your Reviews
          </Button>
          <Button size="compact-sm" onClick={logout} w="100%">
            Logout
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default User
