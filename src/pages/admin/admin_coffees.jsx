import { ActionIcon, Badge, Button, Group, Stack, Table, Title } from '@mantine/core'
import { firebaseFetchAllCoffee } from '../../firebase/api'
import { formatFirestoreTimestamp } from '../../utils'
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'

function Score({ score }) {

  const getColor = () => {
    let color = 'green'

    if (score < 7.5 && score >= 5) color = 'yellow'
    if (score < 5) color ='red'

    return color
  }

  return (
    <Title order={3} c={getColor()} color={getColor()}>{score}</Title>
  )
}

export default function AdminCoffees() {
  const { data: coffees } = useQuery(['admin-coffees'], firebaseFetchAllCoffee)
  const navigate = useNavigate()

  return (
    <Stack gap="20px">
      <Group justify="flex-end">
        <Button leftSection={<IconPlus />} size="compact-lg" onClick={() => navigate('/coffee/new')}>
          Add a Coffee
        </Button>
      </Group>
      <Table.ScrollContainer minWidth={650}>
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Roaster</Table.Th>
              <Table.Th>Origin</Table.Th>
              <Table.Th>Date Added</Table.Th>
              <Table.Th>Score</Table.Th>
              <Table.Th>Actions</Table.Th>
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
                    <Score score={coffee.score} />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="10px">
                      <ActionIcon variant="transparent" onClick={() => navigate(`/coffee/edit/${coffee.id}`)}>
                        <IconPencil />
                      </ActionIcon>
                      <ActionIcon variant="transparent" color="red">
                        <IconTrash />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  )
}
