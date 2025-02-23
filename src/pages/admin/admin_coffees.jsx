import { ActionIcon, Center, Group, Paper, Table, Title } from '@mantine/core'
import useCustomQuery from '../../hooks/useCustomQuery'
import { fetchCoffeeItems } from '../../firebase/api'
import { formatFirestoreTimestamp } from '../../utils'
import CoffeeBadge from '../../components/coffee_badge'
import { IconPencil, IconTrash } from '@tabler/icons-react'

function Score({ score }) {

  const getColor = () => {
    let color = 'green'

    if (score < 75 && score >= 50) color = 'yellow'
    if (score < 50) color ='red'

    return color
  }

  return (
    <Title order={2} c={getColor()} color={getColor()}>{score}</Title>
  )
}

export default function AdminCoffees() {
  const { data: coffees } = useCustomQuery(['admin-coffees'], fetchCoffeeItems)

  return (
    <Center>
      <Paper radius="lg" p="20px" w="100%" mt="10px">
        <Table>
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
                  <Table.Td>{coffee.roaster}</Table.Td>
                  <Table.Td>
                    <Group gap="10px">
                      {coffee.origin_region.map((origin) => (
                        <CoffeeBadge key={origin} origin={origin} />
                      ))}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {formatFirestoreTimestamp(coffee.date_added)}
                  </Table.Td>
                  <Table.Td>
                    <Score score={coffee.score} />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="10px">
                      <ActionIcon variant="white">
                        <IconPencil />
                      </ActionIcon>
                      <ActionIcon variant="white" color="red">
                        <IconTrash />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Center>
  )
}
