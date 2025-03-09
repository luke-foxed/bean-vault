import { Card, Image, Group, Text, ThemeIcon, Stack, Badge, Tooltip, UnstyledButton, Flex } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconStarFilled } from '@tabler/icons-react'
import CoffeeModal from './coffee_modal'
import { generateCoffeeThumbnail } from '../../utils'

export default function CoffeeCard({ coffee }) {
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <Flex justify="center">
      <UnstyledButton onClick={open} w={{ base: 180, xs: 220, sm: 240, md: 260 }}>
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
                <ThemeIcon size="xs" variant="white" color="yellow">
                  <IconStarFilled />
                </ThemeIcon>
                <Text fw={400} size="md">
                  {coffee.score}
                </Text>
              </Group>
            </Group>
            <Group gap="10px" wrap="nowrap">
              {coffee.regions.map((region) => (
                <Tooltip key={region.name} label={region.name}>
                  <Badge w="max-content" variant="light" color={region.color}>
                    {region.name}
                  </Badge>
                </Tooltip>
              ))}
            </Group>
          </Stack>
        </Card>
      </UnstyledButton>

      <CoffeeModal opened={opened} coffee={coffee} onClose={close} />
    </Flex>
  )
}
