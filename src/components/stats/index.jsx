import { useQuery } from 'react-query'
import { firebaseFetchUserCount } from '../../firebase/api/auth'
import { firebaseFetchCoffeeCount } from '../../firebase/api/coffee'
import { firebaseFetchReviewCount } from '../../firebase/api/review'
import { firebaseFetchRoasterCount } from '../../firebase/api/roasters'
import { SimpleGrid, Paper, Stack, Text, Title, ThemeIcon, Group, Loader, Transition, useMantineColorScheme, useMantineTheme, alpha } from '@mantine/core'
import { IconCoffee, IconCooker, IconStar, IconUsers, IconChartBar } from '@tabler/icons-react'
import { Heading } from '../layout'
import { useState } from 'react'

const getAllStats = async () => {
  const [coffeeCount, reviewCount, userCount, roasterCount] = await Promise.all([
    firebaseFetchCoffeeCount(),
    firebaseFetchReviewCount(),
    firebaseFetchUserCount(),
    firebaseFetchRoasterCount(),
  ])

  return { coffeeCount, reviewCount, userCount, roasterCount }
}

const StatCard = ({ title, value, icon: Icon, color, transitionStyles }) => {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const baseColor = colorScheme === 'dark' ? theme.colors[color][6] : theme.colors[color][2]
  const borderColor = alpha(baseColor, 0.3)

  return (
    <Paper bd={`2px solid ${borderColor}`} shadow="md" radius="lg" p="xl" withBorder h={200} w="100%" style={transitionStyles}>
      <Stack align="center" justify="center" h="100%" gap="xs">
        <ThemeIcon size={60} radius="md" variant="light" color={color}>
          <Icon size={32} />
        </ThemeIcon>
        <Title order={2} ta="center">
          {value}
        </Title>
        <Text size="md" c="dimmed" ta="center" fw={500}>
          {title}
        </Text>
      </Stack>
    </Paper>
  )
}

const AnimatedStatCard = ({ title, value, icon, color, mounted, delay = 0 }) => (
  <Transition transition="fade-up" duration={800} timingFunction="ease" mounted={mounted} delay={delay}>
    {(styles) => (
      <StatCard
        title={title}
        value={value}
        icon={icon}
        color={color}
        transitionStyles={styles}
      />
    )}
  </Transition>
)

export default function Stats() {
  const [mounted, setMounted] = useState(false)
  const { data: stats, isLoading } = useQuery(['stats'], getAllStats, {
    onSuccess: () => setTimeout(() => setMounted(true), 50),
  })

  if (isLoading) return <Loader />

  return (
    <Stack w="100%" mb={100}>
      <Group justify="space-between" w="100%" px="xl">
        <Heading icon={IconChartBar} title="APP STATS" />
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 'sm', sm: 'md', lg: 'xl' }} w="100%" px="xl">
        <AnimatedStatCard
          title="Total Coffees"
          value={stats?.coffeeCount || 0}
          icon={IconCoffee}
          color="blue"
          mounted={mounted}
        />
        <AnimatedStatCard
          title="Total Reviews"
          value={stats?.reviewCount || 0}
          icon={IconStar}
          color="yellow"
          mounted={mounted}
          delay={100}
        />
        <AnimatedStatCard
          title="Total Users"
          value={stats?.userCount || 0}
          icon={IconUsers}
          color="green"
          mounted={mounted}
          delay={200}
        />
        <AnimatedStatCard
          title="Total Roasters"
          value={stats?.roasterCount || 0}
          icon={IconCooker}
          color="orange"
          mounted={mounted}
          delay={300}
        />
      </SimpleGrid>
    </Stack>
  )
}
