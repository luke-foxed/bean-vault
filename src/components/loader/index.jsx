import { LoadingOverlay } from '@mantine/core'

export default function Loader({ open, children, ...overlapProps }) {
  return open ? <LoadingOverlay visible {...overlapProps} /> : children()
}
