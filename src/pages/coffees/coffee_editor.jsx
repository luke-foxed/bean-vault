import {
  Button,
  Center,
  FileInput,
  Group,
  Image,
  Loader,
  LoadingOverlay,
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
import { firebaseAddCoffee, firebaseFetchCoffeeById, firebaseFetchRegions, firebaseFetchRoasters, firebaseUpdateCoffee } from '../../firebase/api'
import { useMemo, useState } from 'react'
import { IconStar } from '@tabler/icons-react'
import { useNotify } from '../../providers/notifcation_provider'
import { useNavigate, useParams } from 'react-router-dom'
import newCoffeeForm from '../../forms/new_coffee_form'
import { useMutation, useQuery } from 'react-query'

const FileInputValue = ({ value }) => {
  if (!value) return null

  // if in the 'edit' flow, the value is gonna be an image url
  const name = typeof value === 'string' ? value : value.name

  return <Pill maw="75%">{name}</Pill>
}

export default function CoffeeEditor() {
  const { notify } = useNotify()
  const navigate = useNavigate()
  const { id } = useParams()
  const form = useForm(newCoffeeForm)
  const [imagePreview, setImagePreview] = useState(null)
  const { data: regions, isLoading: loadingRegions } = useQuery(['regions'], firebaseFetchRegions)
  const { data: roasters, isLoading: loadingRoasters } = useQuery(['roasters'], firebaseFetchRoasters)
  const { isLoading: loadingCoffee } = useQuery([`coffee-${id}`], () => firebaseFetchCoffeeById(id), { onSuccess: form.setValues, enabled: !!id })
  const { mutate: saveCoffee, isLoading: loadingSave } = useMutation(
    id ? ['update-coffee'] : ['add-coffee'],
    id ? firebaseUpdateCoffee : firebaseAddCoffee,
    {
      onSuccess: () => {
        notify('success', `Coffee ${id ? 'updated' : 'added'} successfully!`)
        navigate(id ? '/admin' : '/coffees')
      },
    },
  )

  const regionOptions = useMemo(() => {
    return (regions || []).map((region) => ({ value: region.id, label: region.name, color: region.color }))
  }, [regions])

  const roasterOptions = useMemo(() => {
    return (roasters || []).map((roaster) => ({ value: roaster.id, label: roaster.name }))
  }, [roasters])

  const handleSubmit = async (submittedCoffee) => {
    if (!id) return saveCoffee(submittedCoffee)
    saveCoffee({ ...submittedCoffee })

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

  const handleFileChange = (file) => {
    if (file) {
      form.setFieldValue('image', file)
      const objectURL = URL.createObjectURL(file)
      setImagePreview(objectURL)
    }
  }

  return (
    <Center mt={200}>
      <Paper radius="lg" shadow="md" w="75%" h="30%" mah="30%">

        <LoadingOverlay visible={(Boolean(id) && loadingCoffee) || loadingSave} />

        <SimpleGrid cols={{ sm: 1, md: 2 }} spacing="xl">
          <Image
            style={{ borderRadius: '16px 0px 0px 16px' }}
            h="100%"
            fit="cover"
            fallbackSrc="https://placehold.co/570x570?text=Coffee+Image"
            src={imagePreview ?? form.getValues().image}
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
              <TextInput
                mt="md"
                label="About"
                placeholder="About the coffee"
                withAsterisk
                key={form.key('about')}
                {...form.getInputProps('about')}
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
              <PillsInput
                mt="md"
                label="Flavour Notes"
                key={form.key('flavour_notes')}
                {...form.getInputProps('flavour_notes')}
              >
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

              <FileInput
                accept="image/*"
                mt="md"
                label="Image"
                withAsterisk
                key={form.key('image')}
                {...form.getInputProps('image')}
                onChange={handleFileChange}
                valueComponent={FileInputValue}
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
