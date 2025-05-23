import { Switch, useMantineColorScheme } from '@mantine/core'
import { IconMoonStars, IconSun } from '@tabler/icons-react'

export default function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const isDarkMode = colorScheme === 'dark'

  return (
    <Switch
      size="md"
      color="gray"
      onChange={() => setColorScheme(isDarkMode ? 'light' : 'dark')}
      onLabel={<IconSun style={{ cursor: 'pointer' }} size={16} stroke={2.5} color="var(--mantine-color-yellow-4)" />}
      offLabel={<IconMoonStars style={{ cursor: 'pointer' }} size={16} stroke={2.5} color="var(--mantine-color-blue-6)" />}
    />
  )
}
