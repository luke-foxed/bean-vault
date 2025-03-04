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
  useMantineTheme,
  Container,
} from '@mantine/core'
import { firebaseFetchAllCoffee } from '../../firebase/api'
import useCustomQuery from '../../hooks/useCustomQuery'
import { IconStarFilled } from '@tabler/icons-react'

const getGradient = (regions, theme) => {
  const colors = regions.map((region) => theme.colors[region.color]?.[4] || region.color)
  return `linear-gradient(90deg, ${colors[0]}, white)`
}

function CoffeeCard({ coffee }) {
  const theme = useMantineTheme()

  return (
    <Card shadow="sm" padding="lg" radius="lg" w={260}>
      <Card.Section>
        <Image src={coffee.image} h={200} fit="cover" />
      </Card.Section>

      <Stack gap="10px">
        <Group justify="space-between" gap="10px" mt="10px">
          <Text fw={500} size="lg" truncate="end" w="70%">
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
        <SimpleGrid cols="2" spacing={4} verticalSpacing={4} h="50px">
          {coffee.regions.map((region) => (
            <Badge key={region.name} variant="light" color={region.color}>
              {region.name}
            </Badge>
          ))}
        </SimpleGrid>
        <Card.Section>

          <Container p="10px" bg={getGradient(coffee.regions, theme)}>
            <Title order={2} c="white">
              {coffee.roaster?.name}
            </Title>
          </Container>
        </Card.Section>
      </Stack>
    </Card>
  )
}

export default function Coffees() {
  const { data, isLoading } = useCustomQuery(['coffees'], firebaseFetchAllCoffee)

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
