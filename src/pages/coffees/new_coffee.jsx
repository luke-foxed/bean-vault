import {
  Button,
  Center,
  Group,
  Image,
  Loader,
  MultiSelect,
  Paper,
  Pill,
  PillsInput,
  Select,
  SimpleGrid,
  Slider,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import useCustomQuery from '../../hooks/useCustomQuery'
import { firebaseAddCoffee, firebaseFetchRegions, firebaseFetchRoasters } from '../../firebase/api'
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
  const { data: regions, isLoading: loadingRegions } = useCustomQuery(['regions'], firebaseFetchRegions)
  const { data: roasters, isLoading: loadingRoasters } = useCustomQuery(['roasters'], firebaseFetchRoasters)
  const { mutate: addCoffee } = useCustomMutation(['add-coffee'], firebaseAddCoffee, {
    onSuccess: () => {
      notify('success', 'Coffee added successfully!')
      navigate('/coffees')
    },
  })

  const regionOptions = useMemo(() => {
    return (regions || []).map((region) => ({ value: region.id, label: region.name, color: region.color }))
  }, [regions])

  const roasterOptions = useMemo(() => {
    return (roasters || []).map((roaster) => ({ value: roaster.id, label: roaster.name }))
  }, [roasters])

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

  const handleSubmit = async (coffee) => {
    const coffeeWithRoaster = { roaster_id: coffee.roaster, ...coffee }
    addCoffee(coffeeWithRoaster)
  }

  const handleAddNote = (event) => {
    if (event.key === ',' || event.type === 'blur') {
      const note = event.target.value.trim()
      if (note && !form.getValues().flavour_notes.includes(note)) {
        form.setFieldValue('flavour_notes', [...form.getValues().flavour_notes, note])
      }
      event.target.value = ''
      event.preventDefault()
    }
  }

  const handleRemoveNote = (note) => {
    const updatedNotes = form.getValues().flavour_notes.filter((n) => n !== note)
    form.setFieldValue('flavour_notes', updatedNotes)
  }

  return (
    <Center mt={200}>
      <Paper radius="lg" shadow="md" w="70%" h="30%" mah="30%">
        <SimpleGrid cols={{ sm: 1, md: 2 }} spacing="xl">
          <Image
            style={{ borderRadius: '16px 0px 0px 16px' }}
            h="100%"
            fit="cover"
            fallbackSrc="https://placehold.co/570x570?text=Coffee+Image"
            src={form.getValues().image}
          />
          <Stack p="30px">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Coffee Name"
                placeholder="Coffee Name"
                withAsterisk
                key={form.key('name')}
                {...form.getInputProps('name')}
              />
              <Select
                rightSection={loadingRoasters && <Loader size="sm" />}
                disabled={loadingRoasters}
                label="Roaster"
                placeholder="Select roaster"
                data={roasterOptions || []}
                searchable
                clearable
                mt="md"
                key={form.key('roaster')}
                {...form.getInputProps('roaster')}
              />
              <PillsInput mt="md" label="Flavour Notes" key={form.key('flavour_notes')} {...form.getInputProps('flavour_notes')}>
                <Pill.Group>
                  {form.getValues().flavour_notes.map((note) => (
                    <Pill key={note} withRemoveButton onRemove={() => handleRemoveNote(note)}>
                      {note}
                    </Pill>
                  ))}
                  <PillsInput.Field
                    autoFocus
                    placeholder="Enter flavour notes (use the 'comma' key to enter multiple)"
                    onKeyDown={handleAddNote}
                    onBlur={handleAddNote}
                  />
                </Pill.Group>
              </PillsInput>

              <MultiSelect
                rightSection={loadingRegions && <Loader size="sm" />}
                disabled={loadingRegions}
                label="Regions"
                placeholder="Select regions"
                data={regionOptions || []}
                searchable
                clearable
                mt="md"
                key={form.key('regions')}
                {...form.getInputProps('regions')}
              />

              <TextInput
                mt="md"
                label="Image"
                placeholder="Image URL"
                withAsterisk
                key={form.key('image')}
                {...form.getInputProps('image')}
                onChange={debouncedTestImage}
              />

              <TextInput
                label="Additional Notes"
                placeholder="Additional Notes"
                mt="md"
                key={form.key('additional_notes')}
                {...form.getInputProps('additional_notes')}
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
          </Stack>
        </SimpleGrid>
      </Paper>
    </Center>
  )
}
