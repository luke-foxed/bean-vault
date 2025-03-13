import { Popover, Avatar, Button, Stack, Divider } from '@mantine/core'
import { useAuth } from '../../providers/auth_provider'
import RoleBadge from '../role_badge'

function User({ currentUser, opened, toggle }) {
  const { logout } = useAuth()
  return (
    <Popover opened={opened} position="bottom-end" withArrow>
      <Popover.Target>
        <Avatar style={{ cursor: 'pointer' }} color="initials" name={currentUser?.name} onClick={toggle} />
      </Popover.Target>
      <Popover.Dropdown mt="10px" style={{ borderRadius: '10px' }} w="250px">
        <Stack justify="center" align="center" gap="5px">
          <RoleBadge name={currentUser?.name} role={currentUser?.role} />
          <Divider my="sm" variant="dashed" w="100%" />

          <Button size="compact-sm" variant="light" onClick={logout}>
            Logout
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default User
