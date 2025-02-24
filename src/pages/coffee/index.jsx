import {
  Card,
  Center,
  Grid,
  Image,
  LoadingOverlay,
  Group,
  Text,
  ThemeIcon,
  Title,
  SimpleGrid,
  Stack,
  Badge,
} from '@mantine/core'
import { fetchCoffeeItems } from '../../firebase/api'
import useCustomQuery from '../../hooks/useCustomQuery'
import { IconStarFilled } from '@tabler/icons-react'

function CoffeeCard({ coffee }) {
  return (
    <Card shadow="sm" padding="xl" radius="xl" w={250}>
      <Card.Section>
        <Image src={coffee.image} h={200} fit="contain" />
      </Card.Section>

      <Stack gap={10}>
        <Group justify="space-between" gap={5}>
          <Text fw={500} size="lg">
            {coffee.name}
          </Text>
          <Group align="center" justify="center" gap={5}>
            <ThemeIcon size="xs" variant="white" color="yellow">
              <IconStarFilled />
            </ThemeIcon>
            <Text fw={500} size="lg">
              {coffee.score}
            </Text>
          </Group>
        </Group>
        <SimpleGrid cols="2" spacing={5} verticalSpacing={5}>
          {coffee.regions.map((region) => (
            <Badge key={region.name} variant="light" color={region.color}>
              {region.name}
            </Badge>
          ))}
        </SimpleGrid>
        <Card.Section>
          <Center bg="grey">
            <Title order={3} c="white">
              {coffee.roaster}
            </Title>
          </Center>
        </Card.Section>
      </Stack>
    </Card>
  )
}

export default function Coffee() {
  const { data, isLoading } = useCustomQuery(['coffee'], fetchCoffeeItems)

  return (
    <>
      <Center mt={200}>
        <h1>COFFEE</h1>
      </Center>

      {isLoading && <LoadingOverlay />}

      {data && (
        <Grid>
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
