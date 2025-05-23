import { Center, Group, Loader, Stack, Transition } from '@mantine/core'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { IconCooker } from '@tabler/icons-react'
import { firebaseFetchRoaster, firebaseFetchRoasters } from '../../firebase/api/roasters'
import { RoasterCard, RoasterModal } from '../../components/roasters'
import { Heading } from '../../components/layout'

export default function Roasters() {
  const [mounted, setMounted] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedRoaster, setSelectedRoaster] = useState(null)
  const params = Object.fromEntries(searchParams.entries())

  const { data: roasters, isLoading: loadingRoasters } = useQuery(['roasters'], () => firebaseFetchRoasters(), { onSuccess: () => setTimeout(() => setMounted(true), 50) })
  const { data: roaster, isLoading: loadingRoaster } = useQuery([params?.id], () => firebaseFetchRoaster(params?.id), { enabled: Boolean(params?.id) && !selectedRoaster })

  const activeRoaster = selectedRoaster || roaster

  const handleOpenModal = (roaster) => {
    setSearchParams({ id: roaster.id })
    setSelectedRoaster(roaster)
  }

  const handleCloseModal = () => {
    setSelectedRoaster(null)
    setSearchParams({})
  }

  return (
    <Center mt={150}>
      <Stack align="center" w="95%">
        <Group justify="space-between" w="100%" align="center">
          <Heading icon={IconCooker} title="ROASTERS" />
        </Group>

        {loadingRoasters && <Loader />}

        <Stack w="100%">
          {roasters && roasters.map((roaster) => (
            <Transition key={roaster.id} transition="fade-down" duration={500} timingFunction="ease" mounted={mounted}>
              {(styles) => (
                <RoasterCard onClick={handleOpenModal} key={roaster.id} roaster={roaster} transitionStyles={styles} />
              )}
            </Transition>
          ))}
        </Stack>

        <RoasterModal
          loading={loadingRoaster}
          opened={Boolean(activeRoaster)}
          roaster={activeRoaster}
          onClose={handleCloseModal}
        />
      </Stack>
    </Center>
  )
}
