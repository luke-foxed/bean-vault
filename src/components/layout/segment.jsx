import { Group, ThemeIcon, Stack, Title, Box, Paper, useMantineColorScheme, ActionIcon } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

export default function Segment({ color, icon: Icon, title, children, fullContainer, onClose }) {
  const { colorScheme } = useMantineColorScheme()
  return (
    <Paper
      bg={colorScheme === 'dark' ? 'dark.6' : 'gray.0'}
      p="sm"
      radius="lg"
      mb="sm"
      shadow="none"
      h={fullContainer ? '100%' : 'auto'}
    >
      <Stack>
        <Group gap="5px">
          <ThemeIcon color={color} size={fullContainer ? 'xl' : 'md'} variant="transparent">
            <Icon />
          </ThemeIcon>
          <Title order={fullContainer ? 2 : 4}>{title}</Title>
          <Group justify="flex-end" style={{ flex: 1 }}>
            {fullContainer && typeof onClose === 'function' && (
              <ActionIcon color={color} onClick={onClose}>
                <IconX />
              </ActionIcon>
            )}
          </Group>
        </Group>
        <Group align="stretch" gap="sm">
          <Box w={4} bg={color} style={{ borderRadius: 8, minHeight: 20 }} />
          <Stack justify="center" style={{ flex: 1 }}>
            {children}
          </Stack>
        </Group>
      </Stack>
    </Paper>
  )
}
