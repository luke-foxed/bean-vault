import { Group, Title } from '@mantine/core'

export default function Heading({ icon: Icon, title }) {
  return (
    <Group gap="sm">
      <Icon size={40} />
      <Title fw={700} >
        {title}
      </Title>
    </Group>
  )
}
