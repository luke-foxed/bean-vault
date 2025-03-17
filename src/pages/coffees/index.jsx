import { Box, Button, Center, Collapse, Grid, Group, Loader, Paper, Stack, Title } from '@mantine/core'
import { firebaseFetchAllCoffee, firebaseFetchCoffee } from '../../firebase/api'
import { CoffeeCard, CoffeeModal } from '../../components/coffees'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Heading from '../../components/heading'
import { IconCoffee, IconFilter, IconMoodEmpty } from '@tabler/icons-react'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import CoffeeFilters from '../../components/coffees/coffee_filters'

export default function Coffees() {
  const [filtersOpen, { toggle: toggleFilters }] = useDisclosure(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const [selectedCoffee, setSelectedCoffee] = useState(null)
  const isMobile = useMediaQuery('(max-width: 50em)')

  const { data: coffees, isLoading: loadingCoffees, isFetched } = useQuery(['coffees', params], () => firebaseFetchAllCoffee(params))
  const { data: coffee, isLoading: loadingCoffee } = useQuery([params?.id], () => firebaseFetchCoffee(params?.id), { enabled: Boolean(params?.id) && !selectedCoffee })

  const activeCoffee = selectedCoffee || coffee

  const handleOpenModal = (coffee) => {
    setSearchParams({ id: coffee.id })
    setSelectedCoffee(coffee)
  }

  const handleCloseModal = () => {
    setSelectedCoffee(null)
    setSearchParams({})
  }

  const handleChangeSearchParams = (key, value) => {
    let val = key === 'roaster' ? value : value?.toLowerCase()
    setSearchParams((params) => {
      const newParams = new URLSearchParams(params)
      if (key === 'sortBy' && !val) val = 'name'
      val ? newParams.set(key, val) : newParams.delete(key)
      return newParams
    })
  }

  return (
    <Center mt={150}>
      <Stack align="center" w="95%">
        <Group justify="space-between" w="100%" align="center">
          <Heading icon={IconCoffee} title="COFFEES" />
          <Button leftSection={<IconFilter />} variant="gradient" hiddenFrom="sm" onClick={toggleFilters}>
            Filter
          </Button>
          <Box visibleFrom="sm">
            <CoffeeFilters filters={searchParams} onChangeFilters={handleChangeSearchParams} />
          </Box>
        </Group>

        <Collapse in={isMobile && filtersOpen} hiddenFrom="sm">
          <Paper shadow="md" p="md" radius="lg">
            <CoffeeFilters filters={searchParams} onChangeFilters={handleChangeSearchParams} />
          </Paper>
        </Collapse>

        {loadingCoffees && <Loader />}

        <Grid
          w="95vw"
          m="auto"
          gutter={{ base: 'sm', sm: 'md', lg: 'xl' }}
          align="center"
          breakpoints={{ xs: '200px', sm: '250px', md: '600px', lg: '800px', xl: '1400px' }}
        >
          {coffees &&
            coffees.map((coffee) => (
              <Grid.Col key={coffee.id} span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 4, xl: 2.4 }}>
                <CoffeeCard coffee={coffee} onClick={(coffee) => handleOpenModal(coffee)} />
              </Grid.Col>
            ))}

          {isFetched && !coffees?.length && (
            <Grid.Col span={12}>
              <Paper shadow="md" p="xl" radius="lg">
                <Stack align="center">
                  <IconMoodEmpty size={60} />
                  <Title order={1}>No coffees found!</Title>
                </Stack>
              </Paper>
            </Grid.Col>
          )}
        </Grid>

        <CoffeeModal
          loading={loadingCoffee}
          opened={Boolean(activeCoffee)}
          coffee={activeCoffee}
          onClose={handleCloseModal}
        />
      </Stack>
    </Center>
  )
}
