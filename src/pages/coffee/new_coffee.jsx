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
import { hasLength, isInRange, isNotEmpty, matches, useForm } from '@mantine/form'
import useCustomQuery from '../../hooks/useCustomQuery'
import { firebaseAddCoffee, firebaseFetchRegions } from '../../firebase/api'
import { useMemo } from 'react'
import { IconStar } from '@tabler/icons-react'

const URL_REGEX = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-.]*)*\/?$/

export default function NewCoffee() {
  const { data, isLoading } = useCustomQuery(['coffee-regions'], firebaseFetchRegions)
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      image: '',
      roaster: '',
      regions: [],
      notes: [],
      score: 5,
    },

    validate: {
      name: hasLength({ min: 2 }, 'Name must have a minimum of 3 characters'),
      roaster: isNotEmpty('Enter the roaster'),
      regions: isNotEmpty('Enter the coffee origin'),
      score: isInRange({ min: 1, max: 10 }, 'Score must be between 1 and 10'),
      image: matches(URL_REGEX, 'Image must be a valid URL'),
    },
  })

  const regions = useMemo(() => {
    return (data || []).map((region) => ({ value: region?.id.toString(), label: region?.name, color: region?.color }))
  }, [data])

  const handleSubmit = async (coffee) => {
    const res = await firebaseAddCoffee(coffee)
    console.log(res)
  }

  const handleAddNote = (event) => {
    if (event.key === ',' || event.type === 'blur') {
      const note = event.target.value.trim()
      if (note && !form.values.notes.includes(note)) {
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
              <Text mt="md" size="sm">
                Score
              </Text>
              <Slider
                thumbChildren={<IconStar size={16} />}
                thumbSize={22}
                styles={{ thumb: { borderWidth: 2, padding: 3 } }}
                defaultValue={5}
                min={1}
                max={10}
                step={0.1}
                key={form.key('score')}
                {...form.getInputProps('score')}
              />

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
                label="Image"
                placeholder="Roaster"
                withAsterisk
                mt="md"
                key={form.key('image')}
                {...form.getInputProps('image')}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
              </Group>
            </form>
          </SimpleGrid>
        </Paper>
      </Stack>
    </Center>
  )
}
