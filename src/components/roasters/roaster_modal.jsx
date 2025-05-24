import {
  Image,
  Text,
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
  Button,
  Group,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks';
import { IconCooker, IconGlobe, IconListSearch, IconQuote, IconX, IconEdit } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../providers/auth_provider'

export default function RoasterModal({ opened, onClose, roaster, loading }) {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
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

      {roaster && (
        <SimpleGrid cols={{ sm: 1, md: 2 }} spacing="xl">
          <Image
            style={isMobile ? {} : { borderRadius: '16px 0px 0px 16px' }}
            h="100%"
            fit="cover"
            fallbackSrc="https://placehold.co/570x570?text=Coffee+Image"
            src={roaster.image}
          />
          <ActionIcon visibleFrom="sm" pos="absolute" top="20px" right="20px" variant="transparent" onClick={onClose}>
            <IconX />
          </ActionIcon>
          <Stack gap="10px" p="30px">
            <Center>
              <Stack gap="10px" align="center">
                <Badge h="max-content" leftSection={<IconCooker />}>
                  <Title order={3} style={{ textAlign: 'center' }}>
                    {roaster.name}
                  </Title>
                </Badge>

                <Group gap="5px" justify="center">
                  <Text ta="center">{roaster.location}</Text>

                  {isAdmin && (
                    <ActionIcon
                      variant="light"
                      color="blue"
                      size="sm"
                      onClick={() => navigate(`/roaster/edit/${roaster.id}`)}
                    >
                      <IconEdit />
                    </ActionIcon>
                  )}
                </Group>
              </Stack>
              <ActionIcon hiddenFrom="sm" pos="absolute" top="30px" right="20px" variant="white" onClick={onClose}>
                <IconX color="black" />
              </ActionIcon>
            </Center>

            <Divider />

            <Blockquote color="blue" cite={`- ${roaster.name}`} icon={<IconQuote />} mt="xl">
              {roaster.about}
            </Blockquote>

            <Center mt="md" mb="md">
              <Title order={3}>More From {roaster.name}</Title>
            </Center>

            <SimpleGrid cols={{ sm: 1, md: 2 }} spacing="md">
              <Button
                variant="outline"
                fullWidth
                size="compact-lg"
                leftSection={<IconGlobe />}
                component="a"
                href={roaster.website}
                target="_blank"
              >
                Visit Website
              </Button>
              <Button
                fullWidth
                size="compact-lg"
                leftSection={<IconListSearch />}
                onClick={() => navigate(`/coffees?roaster=${roaster.id}`)}
              >
                Explore Coffees
              </Button>
            </SimpleGrid>
          </Stack>
        </SimpleGrid>
      )}
    </Modal>
  )
}
