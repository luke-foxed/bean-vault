import { ActionIcon, Skeleton, Stack, Table } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useQuery } from 'react-query'
import RoleBadge from '../../components/role_badge'
import { firebaseFetchAllUsers } from '../../firebase/api/auth'

export default function AdminUsers() {
  const { data: users, isLoading: loadingUsers } = useQuery(['admin-users'], firebaseFetchAllUsers)

  return (
    <Stack gap="20px">
      <Skeleton visible={loadingUsers}>
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
      </Skeleton>
    </Stack>
  )
}
