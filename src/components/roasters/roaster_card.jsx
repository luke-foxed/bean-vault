import { Button, Grid, Image, Paper, Stack, Text, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconArrowRight } from '@tabler/icons-react'

export default function RoasterCard({ roaster, onClick }) {
  const isMobile = useMediaQuery('(max-width: 50em)')
  return (
    <Paper shadow="md" radius="lg" h="auto" w="100%" p="0">
      <Grid breakpoints={{ xs: '200px', sm: '250px', md: '600px', lg: '800px', xl: '1400px' }}>
        <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 4 }}>
          <Image
            h="180px"
            w="100%"
            fit="cover"
            src={roaster.image}
            style={{ borderRadius: isMobile ? '16px 16px 0px 0px' : '16px 0px 0px 16px' }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 4 }}>
          <Stack align="flex-start" justify="center" gap="0px" h="100%" p="20px">
            <Title order={1}>{roaster.name}</Title>
            <Text size="xl">{roaster.location}</Text>
            <Button leftSection={<IconArrowRight />} mt="md" size="compact-lg" variant="outline" onClick={() => onClick(roaster)}>
              View Roaster
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}
