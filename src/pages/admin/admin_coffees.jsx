import { ActionIcon, Badge, Button, Group, Stack, Table, Title, Skeleton, Text } from '@mantine/core'
import { formatFirestoreTimestamp } from '../../utils'
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { firebaseDeleteCoffee, firebaseFetchCoffees } from '../../firebase/api/coffee'
import { useAuth } from '../../providers/auth_provider'
import { modals } from '@mantine/modals'

function Score({ score }) {
  const getColor = () => {
    if (!score) return 'gray'

    if (score >= 8) return 'green'
    if (score < 8 && score >= 5) return 'yellow'
    if (score < 5) return 'red'

    return 'gray'
  }

  return (
    <Title order={4} c={getColor()} color={getColor()}>
      {score ?? 'N/A'}
    </Title>
  )
}

export default function AdminCoffees() {
  const { data: coffees, isLoading: loadingCoffees, refetch } = useQuery(['coffees'], firebaseFetchCoffees)
  const { isSuperAdmin } = useAuth()
  const navigate = useNavigate()

  const { mutate: deleteCoffee } = useMutation(['delete-coffee'], (id) => firebaseDeleteCoffee(id), {
    onSuccess: () => {
      refetch()
    },
  })

  const handleClickDeleteCoffee = (id) => {
    modals.openConfirmModal({
      title: <Title order={3}>Delete Coffee</Title>,
      children: <Text>Are you sure you want to delete this coffee? This action cannot be undone.</Text>,
      labels: {
        confirm: 'Delete Coffee',
        cancel: 'Cancel',
      },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteCoffee(id)
      },
    })
  }

  return (
    <Stack gap="20px">
      <Group justify="flex-end">
        <Button leftSection={<IconPlus />} size="compact-lg" onClick={() => navigate('/coffee/new')}>
          Add a Coffee
        </Button>
      </Group>

      <Skeleton visible={loadingCoffees}>
        <Table.ScrollContainer minWidth={650}>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th fz="20px">Name</Table.Th>
                <Table.Th fz="20px">Roaster</Table.Th>
                <Table.Th fz="20px">Origin</Table.Th>
                <Table.Th fz="20px">Date Added</Table.Th>
                <Table.Th fz="20px">Score</Table.Th>
                <Table.Th fz="20px">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {coffees &&
                coffees.map((coffee) => (
                  <Table.Tr key={coffee.name}>
                    <Table.Td>{coffee.name}</Table.Td>
                    <Table.Td>{coffee.roaster.name}</Table.Td>
                    <Table.Td>
                      <Group gap="10px" visibleFrom="md">
                        {coffee.regions.map((region) => (
                          <Badge key={region.name} variant="light" color={region.color}>
                            {region.name}
                          </Badge>
                        ))}
                      </Group>

                      <Stack gap="10px" hiddenFrom="sm">
                        {coffee.regions.map((region) => (
                          <Badge key={region.name} variant="light" color={region.color} w="100%">
                            {region.name}
                          </Badge>
                        ))}
                      </Stack>
                    </Table.Td>
                    <Table.Td>{formatFirestoreTimestamp(coffee.date_added)}</Table.Td>
                    <Table.Td>
                      <Score score={coffee.average_score} />
                    </Table.Td>
                    <Table.Td>
                      <Group gap="10px">
                        <ActionIcon variant="transparent" onClick={() => navigate(`/coffee/edit/${coffee.id}`)} disabled={!isSuperAdmin}>
                          <IconPencil />
                        </ActionIcon>
                        <ActionIcon variant="transparent" color="red" disabled={!isSuperAdmin} onClick={() => handleClickDeleteCoffee(coffee.id)}>
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
