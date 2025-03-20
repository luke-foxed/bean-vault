import { Center, Group, Loader, Stack } from '@mantine/core'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Heading from '../../components/heading'
import { IconCooker } from '@tabler/icons-react'
import { firebaseFetchRoaster, firebaseFetchRoasters } from '../../firebase/api/roasters'
import { RoasterCard, RoasterModal } from '../../components/roasters'

export default function Roasters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedRoaster, setSelectedRoaster] = useState(null)
  const params = Object.fromEntries(searchParams.entries())

  const { data: roasters, isLoading: loadingRoasters } = useQuery(['roasters'], () => firebaseFetchRoasters())
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
          {roasters &&
            roasters.map((roaster) => <RoasterCard onClick={handleOpenModal} key={roaster.id} roaster={roaster} />)}
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
