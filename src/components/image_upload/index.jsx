import { FileInput, Group, Stack, TextInput, Text, SegmentedControl, ActionIcon, Tooltip, Pill } from '@mantine/core'
import { IconRotate } from '@tabler/icons-react'
import { useState } from 'react'

function FileInputValue({ value }) {
  if (!value) return null
  // if in the 'edit' flow, the value is gonna be a cloudinary url so take the 'name' bit of the url
  const name = typeof value === 'string' ? value.split('/').pop() : value.name

  return <Pill maw="75%">{name}</Pill>
}

export default function ImageUpload({ form, onUpdateImage, originalImage }) {
  const [uploadMethod, setUploadMethod] = useState('file')

  const handleUrlChange = (url) => {
    if (!url) {
      form.setFieldValue('image', null)
      return onUpdateImage(null)
    }
    form.setFieldValue('image', url)
    onUpdateImage(url)
  }

  const handleUploadMethodChange = (method) => {
    setUploadMethod(method)
    form.setFieldValue('image', null)
    onUpdateImage(null)
  }

  const handleResetImage = () => {
    if (!form.getValues().image) return
    form.setFieldValue('image', originalImage)
    onUpdateImage(originalImage)
    setUploadMethod('file')
  }

  const handleFileChange = (file) => {
    if (!file) return form.setFieldValue('image', null)

    form.setFieldValue('image', file)
    const objectURL = URL.createObjectURL(file)
    onUpdateImage(objectURL)
  }

  return (
    <Stack mt="md" gap={0}>
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500}>
          Image{' '}
          <Text span c="red">
            *
          </Text>
        </Text>
        <Group gap="xs">
          <Tooltip label="Reset image">
            <ActionIcon variant="subtle" color="gray" onClick={handleResetImage}>
              <IconRotate size={16} />
            </ActionIcon>
          </Tooltip>
          <SegmentedControl
            size="xs"
            value={uploadMethod}
            onChange={handleUploadMethodChange}
            data={[
              { label: 'Upload File', value: 'file' },
              { label: 'Image URL', value: 'url' },
            ]}
            styles={{
              root: {
                border: '1px solid var(--mantine-color-gray-4)',
                borderBottom: 'none',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
              },
            }}
          />
        </Group>
      </Group>
      {uploadMethod === 'file' ? (
        <FileInput
          accept="image/*"
          withAsterisk
          placeholder="Upload image"
          key={form.key('image')}
          {...form.getInputProps('image')}
          onChange={handleFileChange}
          valueComponent={FileInputValue}
          clearable
          styles={{
            input: {
              borderTopRightRadius: 0,
            },
          }}
        />
      ) : (
        <TextInput
          placeholder="Enter image URL"
          withAsterisk
          key={form.key('image')}
          {...form.getInputProps('image')}
          onChange={(event) => handleUrlChange(event.currentTarget.value)}
          clearable
          styles={{
            input: {
              borderTopRightRadius: 0,
            },
          }}
        />
      )}
    </Stack>
  )
}
