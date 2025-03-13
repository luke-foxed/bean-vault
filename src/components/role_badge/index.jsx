import { Badge } from '@mantine/core'
import { IconUserSearch, IconUserStar, IconUserX } from '@tabler/icons-react'

const roleMap = {
  admin: { color: 'green', icon: <IconUserStar /> },
  blocked: { color: 'red', icon: <IconUserX /> },
  viewer: { color: 'orange', icon: <IconUserSearch /> },
}

export default function RoleBadge({ name, role, width = '100%' }) {
  return (
    <Badge leftSection={roleMap[role].icon} size="lg" variant="light" color={roleMap[role].color} w={width}>
      {name && `${name} - `} {role}
    </Badge>
  )
}
