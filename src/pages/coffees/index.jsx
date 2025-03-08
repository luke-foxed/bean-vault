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
        <Grid gutter="xl" align="center">
          {data.map((coffee) => (
            <Grid.Col key={coffee.id} span={{ base: 12, md: 6, lg: 3 }}>
              <CoffeeCard coffee={coffee} />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </>
  )
}
