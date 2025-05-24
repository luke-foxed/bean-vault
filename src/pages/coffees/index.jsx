import { Box, Button, Center, Collapse, Group, Loader, Paper, Stack } from '@mantine/core'
import { firebaseFetchCoffees, firebaseFetchCoffee } from '../../firebase/api/coffee'
import { CoffeeModal, CoffeeFilters } from '../../components/coffees'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { IconCoffee, IconFilter } from '@tabler/icons-react'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { Heading } from '../../components/layout'
import CoffeeGrid from '../../components/coffees/coffee_grid'

export default function Coffees() {
  const [filtersOpen, { toggle: toggleFilters }] = useDisclosure(false)
  const [mounted, setMounted] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCoffee, setSelectedCoffee] = useState(null)
  const isMobile = useMediaQuery('(max-width: 50em)')
  // no need to refetch all coffees when we open the coffee modal
  const params = Object.fromEntries(searchParams.entries().filter(([key]) => key !== 'id'))
  const coffeeId = searchParams.get('id')

  const { data: coffees, isLoading: loadingCoffees, isFetched } = useQuery(['coffees', params], () => firebaseFetchCoffees(params), { onSuccess: () => setTimeout(() => setMounted(true), 50) })
  const { data: coffee, isLoading: loadingCoffee } = useQuery([coffeeId], () => firebaseFetchCoffee(coffeeId), { enabled: Boolean(coffeeId) && !selectedCoffee })

  const activeCoffee = selectedCoffee || coffee

  const handleOpenModal = (coffee) => {
    setSearchParams({ ...params, id: coffee.id })
    setSelectedCoffee(coffee)
  }

  const handleCloseModal = () => {
    setSelectedCoffee(null)
    // params already has ID filtered out
    setSearchParams({ ...params })
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
          <Button leftSection={<IconFilter />} hiddenFrom="sm" onClick={toggleFilters}>
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

        <CoffeeGrid coffees={coffees} onClick={handleOpenModal} mounted={mounted} isFetched={isFetched} />

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
