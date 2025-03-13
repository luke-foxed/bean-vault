import { ActionIcon, Stack, Table } from '@mantine/core'
import { firebaseFetchAllUsers } from '../../firebase/api'
import { IconTrash } from '@tabler/icons-react'
import { useQuery } from 'react-query'
import RoleBadge from '../../components/role_badge'

export default function AdminUsers() {
  const { data: users } = useQuery(['admin-users'], firebaseFetchAllUsers)

  return (
    <Stack gap="20px">
      <Table.ScrollContainer minWidth={650}>
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Display Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users &&
              users.map((user) => (
                <Table.Tr key={user.name}>
                  <Table.Td>{user.name}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>
                    <RoleBadge width="fit-content" role={user.role} />
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon variant="transparent" color="red">
                      <IconTrash />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  )
}
