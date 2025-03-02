import {
  Button,
  Center,
  Group,
  Image,
  LoadingOverlay,
  MultiSelect,
  Paper,
  Pill,
  PillsInput,
  SimpleGrid,
  Slider,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import useCustomQuery from '../../hooks/useCustomQuery'
import { firebaseAddCoffee, firebaseFetchRegions } from '../../firebase/api'
import { useMemo } from 'react'
import { IconStar } from '@tabler/icons-react'
import { isValidImage } from '../../utils'
import { useNotify } from '../../providers/notifcation_provider'
import { useDebouncedCallback } from '@mantine/hooks'
import useCustomMutation from '../../hooks/useCustomMutation'
import { useNavigate } from 'react-router-dom'
import newCoffeeForm from '../../forms/new_coffee_form'

export default function NewCoffee() {
  const { notify } = useNotify()
  const navigate = useNavigate()
  const form = useForm(newCoffeeForm)
  const { data, isLoading } = useCustomQuery(['coffee-regions'], firebaseFetchRegions)
  const { mutate: addCoffee } = useCustomMutation(['addCoffee'], firebaseAddCoffee, {
    onSuccess: () => {
      notify('success', 'Coffee added successfully!')
      navigate('/coffees')
    },
  })

  const regions = useMemo(() => {
    return (data || []).map((region) => ({ value: region?.id.toString(), label: region?.name, color: region?.color }))
  }, [data])

  const debouncedTestImage = useDebouncedCallback(async (event) => {
    const image = event.target?.value
    const isValid = await isValidImage(image)

    if (!isValid) {
      form.setErrors({ ...form.errors, image: 'The URL provided is not a valid image' })
      return notify('error', 'Invalid Image', 'The URL provided is not a valid image')
    }

    form.clearFieldError('image')
    form.setFieldValue('image', image)
  }, 600)

  const handleSubmit = async (coffee) => addCoffee(coffee)

  const handleAddNote = (event) => {
    if (event.key === ',' || event.type === 'blur') {
      const note = event.target.value.trim()
      if (note && !form.getValues().notes.includes(note)) {
        form.setFieldValue('notes', [...form.getValues().notes, note])
      }
      event.target.value = ''
      event.preventDefault()
    }
  }

  const handleRemoveNote = (note) => {
    const updatedNotes = form.getValues().notes.filter((n) => n !== note)
    form.setFieldValue('notes', updatedNotes)
  }

  return (
    <Center mt={200}>
      <Stack>
        <h1>NEW COFFEE</h1>

        <Paper radius="lg" shadow="md" p={30} h="min-content">
          <SimpleGrid cols={{ sm: 1, md: 2 }} spacing="xl">
            <Image
              h={610}
              mt="-30"
              mb="-30"
              ml="-30"
              fit="cover"
              fallbackSrc="https://placehold.co/570x570?text=Coffee+Image"
              style={{ borderRadius: '16px 0px 0px 16px' }}
              src={form.getValues().image}
            />
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Coffee Name"
                placeholder="Coffee Name"
                withAsterisk
                key={form.key('name')}
                {...form.getInputProps('name')}
              />
              <TextInput
                label="Roaster"
                placeholder="Roaster"
                withAsterisk
                mt="md"
                key={form.key('roaster')}
                {...form.getInputProps('roaster')}
              />
              <PillsInput mt="md" label="Tasting Notes" key={form.key('notes')} {...form.getInputProps('notes')}>
                <Pill.Group>
                  {form.getValues().notes.map((note) => (
                    <Pill key={note} withRemoveButton onRemove={() => handleRemoveNote(note)}>
                      {note}
                    </Pill>
                  ))}
                  <PillsInput.Field
                    autoFocus
                    placeholder="Enter tasting notes (use the 'comma' key to enter multiple)"
                    onKeyDown={handleAddNote}
                    onBlur={handleAddNote}
                  />
                </Pill.Group>
              </PillsInput>

              {isLoading ? (
                <LoadingOverlay />
              ) : (
                <MultiSelect
                  label="Regions"
                  placeholder="Select regions"
                  data={regions || []}
                  searchable
                  clearable
                  mt="md"
                  key={form.key('regions')}
                  {...form.getInputProps('regions')}
                />
              )}

              <TextInput
                mt="md"
                label="Image"
                placeholder="Image URL"
                withAsterisk
                key={form.key('image')}
                {...form.getInputProps('image')}
                onChange={debouncedTestImage}
              />

              <Text mt="md" size="sm">
                Score
              </Text>
              <Slider
                flex={1}
                thumbChildren={<IconStar size={16} />}
                thumbSize={22}
                styles={{ thumb: { borderWidth: 2, padding: 3 } }}
                defaultValue={5}
                min={1}
                max={10}
                step={0.5}
                marks={Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: i + 1 }))}
                key={form.key('score')}
                {...form.getInputProps('score')}
              />

              <Group justify="flex-end" mt="xl">
                <Button type="submit">Submit</Button>
              </Group>
            </form>
          </SimpleGrid>
        </Paper>
      </Stack>
    </Center>
  )
}
