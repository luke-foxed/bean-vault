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
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks';
import { IconCoffee, IconGlobe, IconIceCream2, IconQuote, IconX } from '@tabler/icons-react'

export default function CoffeeModal({ opened, onClose, coffee, loading }) {

  const isMobile = useMediaQuery('(max-width: 50em)')

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
      styles={{ inner: { left: 0 } }} // fix inner modal alignment
    >

      {loading && <Loader />}

      {coffee && (
        <SimpleGrid cols={{ sm: 1, md: 2 }} spacing="xl">
          <Image
            style={ isMobile ? {} : { borderRadius: '16px 0px 0px 16px' }}
            h="100%"
            fit="cover"
            fallbackSrc="https://placehold.co/570x570?text=Coffee+Image"
            src={coffee.image}
          />
          <ActionIcon visibleFrom="sm" pos="absolute" top="20px" right="20px" variant="transparent" onClick={onClose} >
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
          </Stack>
        </SimpleGrid>
      )}

    </Modal>
  )
}
