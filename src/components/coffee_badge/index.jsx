import { Badge } from '@mantine/core';

const ORIGIN_COLOR_MAP = {
  guatamala: 'blue',
  ethiopia: 'teal',
  brazil: 'green',
}

export default function CoffeeBadge({ origin }) {
  return (
    <Badge
      key={origin}
      variant="light"
      color={ORIGIN_COLOR_MAP[origin]}
    >
      {origin}
    </Badge>
  ) }
