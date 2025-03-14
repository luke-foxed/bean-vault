import { Switch, useMantineColorScheme } from '@mantine/core'
import { IconMoonStars, IconSun } from '@tabler/icons-react'

export default function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const isDarkMode = colorScheme === 'dark'

  return (
    <>
      <Switch
        size="md"
        color="gray"
        onLabel={<IconSun size={16} stroke={2.5} color="var(--mantine-color-yellow-4)" />}
        onChange={() => setColorScheme(isDarkMode ? 'light' : 'dark')}
        offLabel={<IconMoonStars size={16} stroke={2.5} color="var(--mantine-color-blue-6)" />}
      />
    </>
  )
}
