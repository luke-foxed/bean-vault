import { ActionIcon, Group, Skeleton, Stack, Table } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { useQuery } from 'react-query'
import { firebaseFetchRoasters } from '../../firebase/api/roasters'
import { useNavigate } from 'react-router-dom'
import { formatFirestoreTimestamp } from '../../utils'

export default function AdminRoasters() {
  const { data: roasters, isLoading: loadingRoasters } = useQuery(['roasters'], firebaseFetchRoasters)
  const navigate = useNavigate()

  return (
    <Stack gap="20px">
      <Skeleton visible={loadingRoasters}>
        <Table.ScrollContainer minWidth={650}>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Date Added</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Website</Table.Th>
                <Table.Th>Actions</Table.Th>
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
                        <ActionIcon variant="transparent" onClick={() => navigate(`/roaster/edit/${roaster.id}`)}>
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
      </Skeleton>
    </Stack>
  )
}
