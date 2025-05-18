import { Grid, Paper, Stack, Title, Transition } from '@mantine/core'
import { IconMoodEmpty } from '@tabler/icons-react'
import CoffeeCard from './coffee_card'

export default function CoffeeGrid({ reviews, coffees, onClick, mounted, isFetched }) {
  return (
    <Grid
      w="95vw"
      m="auto"
      gutter={{ base: 'sm', sm: 'md', lg: 'xl' }}
      align="center"
      breakpoints={{ xs: '200px', sm: '250px', md: '600px', lg: '800px', xl: '1400px' }}
    >
      {coffees &&
        coffees.map((coffee) => (
          <Transition key={coffee.id} transition="fade-left" duration={400} timingFunction="ease" mounted={mounted}>
            {(styles) => (
              <Grid.Col span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 4, xl: 2.4 }} style={styles}>
                <CoffeeCard review={reviews?.[coffee?.id]} coffee={coffee} onClick={(coffee) => onClick(coffee)} />
              </Grid.Col>
            )}
          </Transition>
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
  )
}
