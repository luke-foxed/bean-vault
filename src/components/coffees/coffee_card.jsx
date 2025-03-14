import { Card, Image, Group, Text, ThemeIcon, Stack, Badge, Tooltip, UnstyledButton, Flex, ScrollArea } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
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

export default function CoffeeCard({ coffee, onClick =null }) {
  const isMobile = useMediaQuery('(max-width: 50em)')

  const handleClickCoffee = () => {
    if (onClick) return onClick(coffee)
  }

  return (
    <Flex justify="center">
      <UnstyledButton style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={handleClickCoffee} w={{ base: 175, xs: 220, sm: 240, md: 260 }} p="0">
        <Card shadow="md" padding="md" radius="lg">
          <Card.Section p="10px">
            <Image src={generateCoffeeThumbnail(coffee.image)} h={{ base: 180, sm: 240 }} fit="cover" radius="lg" />
          </Card.Section>

          <Stack gap="10px">
            <Group justify="space-between" gap="10px" mt="10px">
              <Stack gap="0px" w="100%">
                <Text fw={500} size="lg" truncate="end">
                  {coffee.name}
                </Text>
                <Text fw={500} size="sm" c="gray">
                  {coffee.roaster.name}
                </Text>
              </Stack>

              <Group align="center" justify="center" gap={5}>
                <ThemeIcon size="xs" variant="transparent" color="yellow">
                  <IconStarFilled />
                </ThemeIcon>
                <Text fw={400} size="md">
                  {coffee.score}
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
