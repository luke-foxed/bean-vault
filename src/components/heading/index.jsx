import { Group, ThemeIcon, Title } from '@mantine/core'

export default function Heading({ icon: Icon, title, width = 'auto' }) {
  return (
    <Group gap="md" w={width}>
      <ThemeIcon variant="gradient" size={54} radius="lg">
        <Icon size={30} />
      </ThemeIcon>
      <Title fw={700} style={{ fontSize: '2rem' }}>
        {title}
      </Title>
    </Group>
  )
}
