import { Center, Paper, Stack, Tabs, Title } from '@mantine/core'
import { IconCoffee, IconCooker, IconRobot, IconUser, IconUserStar } from '@tabler/icons-react'
import { useLocation, useNavigate } from 'react-router-dom'
import AdminCoffees from './admin_coffees'
import AdminUsers from './admin_users'
import AdminRoasters from './admin_roasters'
import AdminScraper from './admin_scraper'
import Heading from '../../components/heading'
import { useAuth } from '../../providers/auth_provider'

export default function Admin() {
  const navigate = useNavigate()
  const { isSuperAdmin } = useAuth()
  const { pathname } = useLocation()

  let path = pathname.split('/').pop()
  if (path === 'admin') path = 'coffee'

  return (
    <Center mt={150}>
      <Stack w="95%">
        <Heading icon={IconUserStar} title="ADMIN" />
        <Paper radius="lg" p="20px"  m="auto" shadow="lg" w="100%">
          <Tabs variant="outline" value={path || 'coffee'} defaultValue="coffee" onChange={(val) => navigate(`/admin/${val}`)}>
            <Tabs.List>
              <Tabs.Tab value="coffee" leftSection={<IconCoffee style={{ width: 25, height: 25 }} />}>
                <Title order={3}>Coffee</Title>
              </Tabs.Tab>
              <Tabs.Tab value="roasters" leftSection={<IconCooker style={{ width: 25, height: 25 }} />}>
                <Title order={3}>Roasters</Title>
              </Tabs.Tab>
              <Tabs.Tab value="users" leftSection={<IconUser style={{ width: 25, height: 25 }} />} disabled={!isSuperAdmin}>
                <Title order={3}>Users</Title>
              </Tabs.Tab>
              <Tabs.Tab value="scraper" leftSection={<IconRobot style={{ width: 25, height: 25 }} />} disabled={!isSuperAdmin}>
                <Title order={3}>Scraper</Title>
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="coffee" mt="10px">
              <AdminCoffees />
            </Tabs.Panel>

            <Tabs.Panel value="roasters" mt="10px">
              <AdminRoasters />
            </Tabs.Panel>

            <Tabs.Panel value="users" mt="10px">
              {isSuperAdmin ? <AdminUsers /> : <Paper p="20px">Only super admins can view this page</Paper>}
            </Tabs.Panel>

            <Tabs.Panel value="scraper" mt="10px">
              {isSuperAdmin ? <AdminScraper /> : <Paper p="20px">Only super admins can view this page</Paper>}
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Stack>
    </Center>
  )
}
