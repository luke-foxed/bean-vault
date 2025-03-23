import { ActionIcon, Button, Group, Skeleton, Stack, Table, Title, Text } from '@mantine/core'
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery } from 'react-query'
import { firebaseDeleteRoaster, firebaseFetchRoasters } from '../../firebase/api/roasters'
import { useNavigate } from 'react-router-dom'
import { formatFirestoreTimestamp } from '../../utils'
import { useAuth } from '../../providers/auth_provider'
import { modals } from '@mantine/modals'

export default function AdminRoasters() {
  const { data: roasters, isLoading: loadingRoasters, refetch } = useQuery(['roasters'], firebaseFetchRoasters)
  const navigate = useNavigate()
  const { isSuperAdmin } = useAuth()
  const { mutate: deleteRoaster } = useMutation(['delete-roaster'], (id) => firebaseDeleteRoaster(id), {
    onSuccess: () => {
      refetch()
    },
  })

  const handleClickDeleteRoaster = (id) => {
    modals.openConfirmModal({
      title: <Title order={3}>Delete Roaster</Title>,
      children: <Text>Are you sure you want to delete this roaster? This action cannot be undone.</Text>,
      labels: {
        confirm: 'Delete Roaster',
        cancel: 'Cancel',
      },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteRoaster(id)
      },
    })
  }

  return (
    <Stack gap="20px">
      <Group justify="flex-end">
        <Button leftSection={<IconPlus />} size="compact-lg" onClick={() => navigate('/roaster/new')}>
          Add a Roaster
        </Button>
      </Group>
      <Skeleton visible={loadingRoasters}>
        <Table.ScrollContainer minWidth={650}>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th fz="20px">Name</Table.Th>
                <Table.Th fz="20px">Date Added</Table.Th>
                <Table.Th fz="20px">Location</Table.Th>
                <Table.Th fz="20px">Website</Table.Th>
                <Table.Th fz="20px">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {roasters &&
                roasters.map((roaster) => (
                  <Table.Tr key={roaster.name}>
                    <Table.Td>{roaster.name}</Table.Td>
                    <Table.Td>{formatFirestoreTimestamp(roaster.date_added)}</Table.Td>
                    <Table.Td>{roaster.location}</Table.Td>
                    <Table.Td>{roaster.website}</Table.Td>
                    <Table.Td>
                      <Group gap="10px">
                        <ActionIcon
                          variant="transparent"
                          onClick={() => navigate(`/roaster/edit/${roaster.id}`)}
                          disabled={!isSuperAdmin}
                        >
                          <IconPencil />
                        </ActionIcon>
                        <ActionIcon
                          variant="transparent"
                          color="red"
                          disabled={!isSuperAdmin}
                          onClick={() => handleClickDeleteRoaster(roaster.id)}
                        >
                          <IconTrash />
                        </ActionIcon>
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
