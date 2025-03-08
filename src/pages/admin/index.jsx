import { Center, Paper, Tabs, rem } from '@mantine/core'
import { IconCoffee, IconUser } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import AdminCoffees from './admin_coffees'
import AdminUsers from './admin_users'

export default function Admin() {
  const navigate = useNavigate()

  return (
    <>
      <Center mt={200}>
        <h1>ADMIN</h1>
      </Center>

      <Paper radius="lg" p="20px" w="100%" mt="10px">
        <Tabs variant="outline" defaultValue="coffee" onChange={(val) => navigate(`/admin/${val}`)}>
          <Tabs.List>
            <Tabs.Tab value="coffee" leftSection={<IconCoffee style={{ width: rem(12), height: rem(12) }} />}>
              Coffee
            </Tabs.Tab>
            <Tabs.Tab value="users" leftSection={<IconUser style={{ width: rem(12), height: rem(12) }} />}>
              Users
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
    </>
  )
}
