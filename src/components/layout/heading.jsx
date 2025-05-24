import { Group, Title } from '@mantine/core'

export default function Heading({ icon: Icon, title, width = 'auto' }) {
  return (
    <Group gap="md" w={width}>
      <Icon size={40} />
      <Title fw={700} style={{ fontSize: '2rem' }}>
        {title}
      </Title>
    </Group>
  )
}
