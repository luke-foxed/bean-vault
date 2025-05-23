import { Center, Stack, Grid, Text, Divider, Loader, Button, Group, Transition } from '@mantine/core'
import { IconPlaylistAdd, IconArrowRight } from '@tabler/icons-react'
import { firebaseFetchCoffees } from '../../firebase/api/coffee'
import { useQuery } from 'react-query'
import { CoffeeCard } from '../../components/coffees'
import { Heading } from '../../components/layout'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Stats from '../../components/stats'

const queryParams = { limit: 5, sortBy: 'date_added', order: 'desc' }

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { data: coffee = [], isLoading: loadingCoffee } = useQuery(['coffee'], () => firebaseFetchCoffees(queryParams), { onSuccess: () => setTimeout(() => setMounted(true), 50) })
  const navigate = useNavigate()
  return (
    <Center>
      <Stack align="center">
        <Stack align="center" justify="center" mt={150}>
          <Text span size="40px">
            Welcome to
          </Text>{' '}
          <Text span ff="Unica One" size="45px" mt="sm">
            BeanVault 👋
          </Text>
        </Stack>

        <Divider my="xl" w="100%" />

        <Stack align="center">
          <Group justify="space-between" w="100%" align="center">
            <Heading icon={IconPlaylistAdd} title="RECENT COFFEES" />
            <Button
              size="compact-lg"
              leftSection={<IconArrowRight />}
              onClick={() => navigate('/coffees')}
              visibleFrom="sm"
            >
              Explore More
            </Button>
          </Group>

          {loadingCoffee && <Loader />}

          <Grid
            w="95vw"
            m="auto"
            gutter={{ base: 'sm', sm: 'md', lg: 'xl' }}
            align="center"
            breakpoints={{ xs: '200px', sm: '250px', md: '600px', lg: '800px', xl: '1400px' }}
          >
            {coffee.map((coffee) => (
              <Transition key={coffee.id} transition="fade-left" duration={800} timingFunction="ease" mounted={mounted}>
                {(styles) => (
                  <Grid.Col span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 4, xl: 2.4 }} style={styles}>
                    <CoffeeCard coffee={coffee} transitionStyles={styles} onClick={() => navigate(`/coffees?id=${coffee.id}`)} />
                  </Grid.Col>
                )}
              </Transition>
            ))}
          </Grid>

          <Button
            size="compact-lg"
            leftSection={<IconArrowRight />}
            onClick={() => navigate('/coffees')}
            hiddenFrom="sm"
          >
            Explore More
          </Button>

          <Divider my="xl" w="100%" />

          <Stats />

        </Stack>
      </Stack>
    </Center>
  )
}
