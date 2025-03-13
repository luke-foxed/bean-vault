import { Center, Stack, Grid, Text, Divider } from '@mantine/core'
import { IconPlaylistAdd } from '@tabler/icons-react'
import { firebaseFetchAllCoffee } from '../../firebase/api'
import { useQuery } from 'react-query'
import { CoffeeCard } from '../../components/coffees'
import Heading from '../../components/heading'

export default function Home() {
  const { data: coffee } = useQuery(['new-coffee'], () => firebaseFetchAllCoffee({ count: 5, sortByField: 'date_added', sortDirection: 'desc' }))

  return (
    <Center>
      <Stack align="center">
        <Stack align="center" justify="center" mt={150}>
          <Text span size="40px">Welcome to</Text>{' '}
          <Text
            span
            ff="Unica One"
            size="45px"
            mt="sm"
          >
            BeanVault {' '}👋
          </Text>
        </Stack>

        <Divider my="xl" w="100%" />

        <Stack>
          <Heading icon={IconPlaylistAdd} title="Recent Coffees" />

          {coffee && (
            <Grid
              w="95vw"
              m="auto"
              gutter={{ base: 'sm', sm: 'md', lg: 'xl' }}
              align="center"
              breakpoints={{ xs: '200px', sm: '250px', md: '600px', lg: '800px', xl: '1400px' }}
            >
              {coffee.map((coffee) => (
                <Grid.Col key={coffee.id} span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 4, xl: 2.4 }}>
                  <CoffeeCard coffee={coffee} />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Stack>
      </Stack>
    </Center>
  )
}
