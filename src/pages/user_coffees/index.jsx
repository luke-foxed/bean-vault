import { Stack, Group, Loader, Center } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { fetchUserReviews } from '../../firebase/api/review'
import { IconUserHeart } from '@tabler/icons-react'
import { firebaseFetchCoffeesByIds } from '../../firebase/api/coffee'
import Heading from '../../components/heading'
import { useState } from 'react'
import CoffeeGrid from '../../components/coffees/coffee_grid'

export default function UserCoffees() {
  const [mounted, setMounted] = useState(false)
  const { userId } = useParams()

  const { data: reviewsData, isLoading: loadingReviews } = useQuery(['user-reviews', userId], () => fetchUserReviews(userId), { enabled: !!userId })

  const coffeeIDs = reviewsData?.reviews?.map((review) => review?.coffee.id)
  const reviewMap = reviewsData?.reviews?.reduce((acc, review) => { acc[review?.coffee.id] = review; return acc }, {}) || {}

  const { data: coffees, isLoading: loadingCoffees, isFetched } = useQuery(['coffees'], () => firebaseFetchCoffeesByIds(coffeeIDs), {
    onSuccess: () => setTimeout(() => setMounted(true), 50),
    enabled: !!coffeeIDs,
  })

  const isLoading = loadingReviews || loadingCoffees

  return (
    <Center mt={150}>
      <Stack align="center" w="95%">
        <Group justify="space-between" w="100%" align="center">
          <Heading icon={IconUserHeart} title="YOUR COFFEES" />
        </Group>

        {isLoading && <Loader />}

        <CoffeeGrid
          reviews={reviewMap}
          coffees={coffees}
          onClick={(coffee) => window.open(`/coffees?id=${coffee.id}`, '_blank')}
          mounted={mounted}
          isFetched={isFetched}
        />
      </Stack>
    </Center>
  )
}
