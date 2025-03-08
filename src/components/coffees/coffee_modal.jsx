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
} from '@mantine/core'
import { IconCoffee, IconGlobe, IconIceCream2, IconQuote } from '@tabler/icons-react'

export default function CoffeeModal({ opened, onClose, coffee }) {

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      lockScroll={false}
      withCloseButton={false}
      padding={0}
      radius="xl"
      size="auto"
    >
      <SimpleGrid cols={{ sm: 1, md: 2 }} spacing="xl">
        <Image
          style={{ borderRadius: '16px 0px 0px 16px' }}
          h="100%"
          fit="cover"
          fallbackSrc="https://placehold.co/570x570?text=Coffee+Image"
          src={coffee.image}
        />
        <Stack gap="10px" p="30px">
          <Center>
            <Stack gap="10px">
              <Badge h="max-content" leftSection={<IconCoffee />}>
                <Title order={3} style={{ textAlign: 'center' }}>
                  {coffee.name}
                </Title>
              </Badge>

              <Text ta="center" c="gray">
                By{' '}
                <Text span c="dark">
                  {coffee.roaster.name}
                </Text>
              </Text>
            </Stack>
          </Center>

          <Divider />

          <Blockquote color="blue" cite={`- ${coffee.roaster.name}`} icon={<IconQuote />} mt="xl">
            {coffee.about}
          </Blockquote>

          <Group gap="5px">
            <ThemeIcon color="grey" size="sm" variant="white">
              <IconGlobe />
            </ThemeIcon>
            <Title order={4}>Origin</Title>
          </Group>

          <Group gap="10px" wrap="nowrap">
            {coffee.regions.map((region) => (
              <Badge size="lg" key={region.name} w="max-content" variant="light" color={region.color}>
                {region.name}
              </Badge>
            ))}
          </Group>

          <Group gap="5px">
            <ThemeIcon color="grey" size="sm" variant="white">
              <IconIceCream2 />
            </ThemeIcon>
            <Title order={4}>Flavours</Title>
          </Group>
          <Group gap="10px" wrap="nowrap">
            {coffee.flavour_notes.map((flavour) => (
              <Badge size="lg" variant="dot" key={flavour} w="max-content">
                {flavour}
              </Badge>
            ))}
          </Group>
        </Stack>
      </SimpleGrid>
    </Modal>
  )
}
