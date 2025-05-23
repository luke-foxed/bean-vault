import {
  Group,
  ThemeIcon,
  Stack,
  Title,
  Box,
  Paper,
  useMantineColorScheme,
} from '@mantine/core'

export default function Segment({ color, icon: Icon, title, children }) {
  const { colorScheme } = useMantineColorScheme()
  return (
    <Paper bg={colorScheme === 'dark' ? 'dark.6' : 'gray.0'} p="sm" radius="lg" mb="sm" shadow="none">
      <Stack>
        <Group gap="5px">
          <ThemeIcon color={color} size="md" variant="transparent">
            <Icon />
          </ThemeIcon>
          <Title order={4}>{title}</Title>
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
