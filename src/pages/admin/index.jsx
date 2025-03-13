import { Center, Paper, Stack, Tabs, Title } from '@mantine/core'
import { IconCoffee, IconUser, IconUserStar } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import AdminCoffees from './admin_coffees'
import AdminUsers from './admin_users'
import Heading from '../../components/heading'
export default function Admin() {
  const navigate = useNavigate()

  return (
    <Center mt={150}>
      <Stack w="95%">
        <Heading icon={IconUserStar} title="Admin" />
        <Paper radius="lg" p="20px"  m="auto" shadow="lg" w="100%">
          <Tabs variant="outline" defaultValue="coffee" onChange={(val) => navigate(`/admin/${val}`)}>
            <Tabs.List>
              <Tabs.Tab value="coffee" leftSection={<IconCoffee style={{ width: 25, height: 25 }} />}>
                <Title order={3}>Coffee</Title>
              </Tabs.Tab>
              <Tabs.Tab value="users" leftSection={<IconUser style={{ width: 25, height: 25 }} />}>
                <Title order={3}>Users</Title>
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="coffee" mt="10px">
              <AdminCoffees />
            </Tabs.Panel>

            <Tabs.Panel value="users" mt="10px">
              <AdminUsers />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Stack>
    </Center>
  )
}
