import {
  Image,
  Group,
  Text,
  ThemeIcon,
  Stack,
  Badge,
  Modal,
  SimpleGrid,
  Title,
  Divider,
  Center,
  Blockquote,
  ActionIcon,
  RemoveScroll,
  Loader,
  Slider,
  Button,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCoffee, IconGlobe, IconIceCream2, IconQuote, IconX, IconStarFilled, IconStar, IconCheck } from '@tabler/icons-react'
import { useAuth } from '../../providers/auth_provider'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNotify } from '../../providers/notifcation_provider'
import { useState } from 'react'
import { createOrUpdateReview, fetchUserReviewForCoffee } from '../../firebase/api/review'

export default function CoffeeModal({ opened, onClose, coffee, loading }) {
  const isMobile = useMediaQuery('(max-width: 50em)')
  const { currentUser } = useAuth()
  const { notify } = useNotify()
  const queryClient = useQueryClient()
  const [score, setScore] = useState(0)

  const { data: userReview } = useQuery(
    ['user-review', coffee?.id],
    () => fetchUserReviewForCoffee(currentUser?.uid, coffee?.id),
    { enabled: opened, onSuccess: (data) => setScore(data?.score || 0) },
  )

  const { mutate: updateReview, isLoading: isUpdating } = useMutation(
    (score) => createOrUpdateReview(currentUser?.uid, coffee?.id, score),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user-review', coffee?.id])
        notify('success', 'Review updated successfully!')
      },
      onError: (error) => notify('error', error.message),
    },
  )

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      lockScroll={true}
      withCloseButton={false}
      padding={0}
      radius="xl"
      size="auto"
      fullScreen={isMobile}
      className={RemoveScroll.classNames.zeroRight}
      styles={{ inner: { left: 0 } }}
    >
      {loading && <Loader />}

      {coffee && (
        <SimpleGrid cols={{ sm: 1, md: 2 }} spacing="xl">
          <Image
            style={isMobile ? {} : { borderRadius: '16px 0px 0px 16px' }}
            h="100%"
            fit="cover"
            fallbackSrc="https://placehold.co/570x570?text=Coffee+Image"
            src={coffee.image}
          />
          <ActionIcon visibleFrom="sm" pos="absolute" top="20px" right="20px" variant="transparent" onClick={onClose}>
            <IconX />
          </ActionIcon>
          <Stack gap="10px" p="30px">
            <Center>
              <Stack gap="10px">
                <Badge h="max-content" leftSection={<IconCoffee />}>
                  <Title order={3} style={{ textAlign: 'center' }}>
                    {coffee.name}
                  </Title>
                </Badge>

                <Text ta="center">
                  By{' '}
                  <Text span>
                    {coffee.roaster.name}
                  </Text>
                </Text>
              </Stack>
              <ActionIcon hiddenFrom="sm" pos="absolute" top="30px" right="20px" variant="white" onClick={onClose}>
                <IconX color="black" />
              </ActionIcon>
            </Center>

            <Divider />

            <Stack gap="xl" align="center">
              <Group align="center" gap="xl" style={{ width: '100%' }}>
                <Stack gap="xs" style={{ flex: 1 }} align="center">
                  <Group gap="5px" justify="center">
                    <ThemeIcon color="yellow" size="sm" variant="transparent">
                      <IconStarFilled />
                    </ThemeIcon>
                    <Title order={4}>Average Score</Title>
                  </Group>

                  <Group gap="10px" align="center" justify="center">
                    <Text size="lg" fw={500}>{coffee.average_score?.toFixed(1) || 'N/A'}</Text>
                    <Text size="sm" c="dimmed">({coffee.review_count || 0} reviews)</Text>
                  </Group>
                </Stack>

                <Stack gap="xs" style={{ flex: 1 }} align="center">
                  <Group gap="5px" justify="center">
                    <ThemeIcon color="blue" size="sm" variant="transparent">
                      <IconStarFilled />
                    </ThemeIcon>
                    <Title order={4}>Your Score</Title>
                  </Group>

                  <Group gap="10px" align="center" justify="center">
                    <Text size="lg" fw={500}>{userReview?.score?.toFixed(1) || 'N/A'}</Text>
                    {userReview?.created_at && (
                      <Text size="sm" c="dimmed">
                        (Added {new Date(userReview.created_at).toLocaleDateString()})
                      </Text>
                    )}
                  </Group>
                </Stack>
              </Group>
            </Stack>

            <Divider />

            <Blockquote color="blue" cite={`- ${coffee.roaster.name}`} icon={<IconQuote />} mt="xl">
              {coffee.about}
            </Blockquote>

            <Group gap="5px">
              <ThemeIcon color="gray" size="sm" variant="transparent">
                <IconGlobe />
              </ThemeIcon>
              <Title order={4}>Origin</Title>
            </Group>

            <Group gap="10px">
              {coffee.regions.map((region) => (
                <Badge size="lg" key={region.name} w="max-content" variant="light" color={region.color}>
                  {region.name}
                </Badge>
              ))}
            </Group>

            <Group gap="5px">
              <ThemeIcon color="gray" size="sm" variant="transparent">
                <IconIceCream2 />
              </ThemeIcon>
              <Title order={4}>Flavours</Title>
            </Group>
            <Group gap="10px" >
              {coffee.flavour_notes.map((flavour) => (
                <Badge size="lg" variant="dot" key={flavour} w="max-content">
                  {flavour}
                </Badge>
              ))}
            </Group>

            <Divider my="sm" />

            <Group gap="5px">
              <ThemeIcon color="gray" size="sm" variant="transparent">
                <IconStar />
              </ThemeIcon>
              <Title order={4}>Review This Coffee</Title>
            </Group>

            <Stack gap="md">
              <Group align="center" w="100%">
                <Slider
                  value={score}
                  onChange={(score) => setScore(score)}
                  thumbChildren={<IconStar size={16} />}
                  thumbSize={22}
                  styles={{ thumb: { borderWidth: 2, padding: 3 } }}
                  min={0}
                  max={10}
                  step={0.5}
                  marks={Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: i + 1 }))}
                  style={{ flex: 1 }}
                />
                <Button
                  w="100px"
                  variant="light"
                  color="blue"
                  size="sm"
                  leftSection={isUpdating ? <Loader size="xs" /> : <IconCheck size={16} />}
                  onClick={() => updateReview(score)}
                  disabled={isUpdating || score === userReview?.score}
                >
                  Apply
                </Button>
              </Group>
            </Stack>
          </Stack>
        </SimpleGrid>
      )}
    </Modal>
  )
}
