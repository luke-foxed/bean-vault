import { ActionIcon, Group, Select, Skeleton, Stack, Table, Text, Title } from '@mantine/core'
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react'
import { useMutation, useQuery } from 'react-query'
import RoleBadge from '../../components/role_badge'
import { firebaseDeleteUser, firebaseFetchAllUsers, firebaseUpdateUserRole } from '../../firebase/api/auth'
import { useState } from 'react'
import { modals } from '@mantine/modals'

const userRoles = [
  { value: 'admin', label: 'Admin' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'super_admin', label: 'Super Admin' },
]

export default function AdminUsers() {
  const { data: users, isLoading: loadingUsers, refetch } = useQuery(['admin-users'], firebaseFetchAllUsers)
  const [userToEdit, setUserToEdit] = useState(null)
  const { mutate: deleteUser } = useMutation(['delete-user'], (id) => firebaseDeleteUser(id), {
    onSuccess: () => {
      refetch()
    },
  })
  const { mutate: updateUserRole } = useMutation(['update-user-role'], () => firebaseUpdateUserRole(userToEdit.id, userToEdit.role), {
    onSuccess: () => {
      setUserToEdit(null)
      refetch()
    },
  })

  const handleClickDeleteUser = (id) => {
    modals.openConfirmModal({
      title: <Title order={3}>Delete User</Title>,
      children: <Text>Are you sure you want to delete this user? This action cannot be undone.</Text>,
      labels: {
        confirm: 'Delete User',
        cancel: 'Cancel',
      },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteUser(id)
      },
    })
  }

  return (
    <Stack gap="20px">
      <Skeleton visible={loadingUsers}>
        <Table.ScrollContainer minWidth={650}>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th fz="20px">Display Name</Table.Th>
                <Table.Th fz="20px">Email</Table.Th>
                <Table.Th fz="20px">Role</Table.Th>
                <Table.Th fz="20px">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users &&
                users.map((user) => (
                  <Table.Tr key={user.name}>
                    <Table.Td>{user.name}</Table.Td>
                    <Table.Td>{user.email}</Table.Td>
                    <Table.Td>
                      {userToEdit?.id === user.id ? (
                        <Select
                          size="sm"
                          data={userRoles}
                          value={userToEdit.role}
                          onChange={(option) => setUserToEdit({ ...userToEdit, role: option })}
                        />
                      ) : (
                        <RoleBadge width="fit-content" role={user.role} />
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="10px">
                        {userToEdit?.id === user.id ? (
                          <>
                            <ActionIcon
                              variant="transparent"
                              color="green"
                              onClick={() => updateUserRole()}
                            >
                              <IconCheck />
                            </ActionIcon>
                            <ActionIcon
                              variant="transparent"
                              color="red"
                              onClick={() => setUserToEdit(null)}
                            >
                              <IconX />
                            </ActionIcon>
                          </>
                        ) : (
                          <>
                            <ActionIcon
                              variant="transparent"
                              onClick={() => setUserToEdit(user)}
                              disabled={(userToEdit && userToEdit?.id !== user.id)}
                            >
                              <IconPencil />
                            </ActionIcon>
                            <ActionIcon
                              variant="transparent"
                              color="red"
                              disabled={(userToEdit && userToEdit?.id !== user.id)}
                              onClick={() => handleClickDeleteUser(user.id)}
                            >
                              <IconTrash />
                            </ActionIcon>
                          </>
                        )}
                      </Group>
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
