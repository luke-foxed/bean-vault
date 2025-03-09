import { Center, Grid, LoadingOverlay } from '@mantine/core'
import { firebaseFetchAllCoffee } from '../../firebase/api'
import { CoffeeCard } from '../../components/coffees'
import { useQuery } from 'react-query'

export default function Coffees() {
  const { data, isLoading } = useQuery(['coffees'], firebaseFetchAllCoffee)

  return (
    <>
      <Center mt={200}>
        <h1>COFFEE</h1>
      </Center>

      {isLoading && <LoadingOverlay />}

      {data && (
        <Grid
          gutter="xl"
          align="center"
          breakpoints={{ xs: '200px', sm: '250px', md: '600px', lg: '800px', xl: '1400px' }}
        >
          {data.map((coffee) => (
            <Grid.Col key={coffee.id} span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 4, xl: 2.4 }}>
              <CoffeeCard coffee={coffee} />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </>
  )
}
