import { Popover, Avatar, Button, Stack, Divider } from '@mantine/core'
import { useAuth } from '../../providers/auth_provider'
import RoleBadge from '../role_badge'
import ColorSchemeToggle from './color_scheme_toggle'

function User({ currentUser, toggle }) {
  const { logout } = useAuth()

  return (
    <Popover
      position="bottom-end"
      withArrow
      closeOnClickOutside={true}
      onClose={toggle}
      withinPortal={false}
    >
      <Popover.Target>
        <Avatar style={{ cursor: 'pointer' }} color="initials" name={currentUser?.name} onClick={toggle} />
      </Popover.Target>
      <Popover.Dropdown mt="10px" style={{ borderRadius: '10px' }} w="250px">
        <Stack justify="center" align="center" gap="15px">
          <RoleBadge name={currentUser?.name} role={currentUser?.role} />
          <Divider variant="dashed" w="100%" />
          <ColorSchemeToggle />
          <Button size="compact-sm" variant="light" onClick={logout} w="100%">
            Logout
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default User
