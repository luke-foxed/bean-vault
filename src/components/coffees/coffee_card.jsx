import { Card, Image, Group, Text, ThemeIcon, Stack, Badge, Tooltip, UnstyledButton, Flex, ScrollArea, Divider, useMantineColorScheme } from '@mantine/core'
import { useHover, useMediaQuery } from '@mantine/hooks'
import { IconStarFilled } from '@tabler/icons-react'
import { generateCoffeeThumbnail } from '../../utils'

const CoffeeRegions = ({ regions }) => (
  <Group gap="10px" wrap="nowrap">
    {regions.map((region) => (
      <Tooltip key={region.name} label={region.name}>
        <Badge w="max-content" variant="light" color={region.color}>
          {region.name}
        </Badge>
      </Tooltip>
    ))}
  </Group>
)

const renderDate = (review, coffee) => {
  const dateInput = review?.created_at || coffee.date_added?.seconds * 1000
  const dateString = new Date(dateInput).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  return review?.created_at ? `Reviewed ${dateString}` : `Added ${dateString}`
}

export default function CoffeeCard({ review, coffee, onClick = null }) {
  const isMobile = useMediaQuery('(max-width: 50em)')
  const { hovered, ref } = useHover()
  const { colorScheme } = useMantineColorScheme()

  const handleClickCoffee = () => {
    if (onClick) return onClick(coffee)
  }

  let cardColor = colorScheme === 'dark' ? 'dark.7' : 'white'
  if (hovered) cardColor = colorScheme === 'dark' ? 'gray.8' : 'gray.1'

  return (
    <Flex justify="center">
      <UnstyledButton
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        onClick={handleClickCoffee}
        w={{ base: 175, xs: 220, sm: 240, md: 260 }}
        p="0"
      >
        <Card shadow="md" padding="md" radius="lg" ref={ref} {...(onClick && { bg: cardColor })}>
          <Card.Section p="10px">
            <Image src={generateCoffeeThumbnail(coffee.image)} h={{ base: 180, sm: 240 }} fit="cover" radius="lg" />
          </Card.Section>

          <Stack gap="10px">
            <Group justify="space-between" gap="10px" mt="10px">
              <Stack gap="0px" w="100%">
                <Text fw={500} size="lg" truncate="end">
                  {coffee.name}
                </Text>
                <Text fw={500} size="sm" c="gray" truncate="end">
                  {coffee.roaster.name}
                </Text>
              </Stack>

              <Group align="center" justify="center" gap="10px">
                <ThemeIcon size="xs" variant="transparent" color={review?.score ? 'blue' : 'yellow'}>
                  <IconStarFilled />
                </ThemeIcon>
                <Text fw={400} size="md">
                  {coffee.average_score === 0 ? 'N/A' : coffee.average_score}
                </Text>
                <Divider orientation="vertical" />
                <Text fw={400} size="sm" c="dimmed">
                  {renderDate(review, coffee)}
                </Text>
              </Group>
            </Group>
            {isMobile ? (
              <ScrollArea type="always" scrollbarSize={0} offsetScrollbars>
                <CoffeeRegions regions={coffee.regions} />
              </ScrollArea>
            ) : (
              <CoffeeRegions regions={coffee.regions} />
            )}
          </Stack>
        </Card>
      </UnstyledButton>
    </Flex>
  )
}
