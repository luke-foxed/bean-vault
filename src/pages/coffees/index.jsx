import { Center, Grid, Loader, Stack } from '@mantine/core'
import { firebaseFetchAllCoffee, firebaseFetchCoffee } from '../../firebase/api'
import { CoffeeCard, CoffeeModal } from '../../components/coffees'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Heading from '../../components/heading'
import { IconCoffee } from '@tabler/icons-react'

export default function Coffees() {
  const { data: coffees, isLoading: loadingCoffees } = useQuery(['coffees'], firebaseFetchAllCoffee)
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCoffee, setSelectedCoffee] = useState(null)
  const id = searchParams.get('id')
  const { data: coffee, isLoading: loadingCoffee } = useQuery([id], () => firebaseFetchCoffee(id), { enabled: Boolean(id) && !selectedCoffee })

  const activeCoffee = selectedCoffee || coffee

  const handleOpenModal = (coffee) => {
    setSearchParams({ id: coffee.id })
    setSelectedCoffee(coffee)
  }

  const handleCloseModal = () => {
    setSelectedCoffee(null)
    setSearchParams({})
  }

  return (
    <Center mt={150}>
      <Stack align="center">
        <Heading icon={IconCoffee} title="COFFEES" />

        {loadingCoffees && <Loader />}

        {coffees && (
          <Grid
            w="95vw"
            m="auto"
            gutter={{ base: 'sm', sm: 'md', lg: 'xl' }}
            align="center"
            breakpoints={{ xs: '200px', sm: '250px', md: '600px', lg: '800px', xl: '1400px' }}
          >
            {coffees.map((coffee) => (
              <Grid.Col key={coffee.id} span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 4, xl: 2.4 }}>
                <CoffeeCard coffee={coffee} onClick={(coffee) => handleOpenModal(coffee)} />
              </Grid.Col>
            ))}
          </Grid>
        )}

        <CoffeeModal loading={loadingCoffee} opened={Boolean(activeCoffee)} coffee={activeCoffee} onClose={handleCloseModal} />

      </Stack>
    </Center>
  )
}
