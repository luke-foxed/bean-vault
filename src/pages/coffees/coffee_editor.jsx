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
  Stack,
  Textarea,
  TextInput,
  Text,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { firebaseAddCoffee, firebaseFetchCoffeeForEdit, firebaseUpdateCoffee } from '../../firebase/api/coffee'
import { useMemo, useState } from 'react'
import { IconCirclePlus, IconEditCircle, IconWand } from '@tabler/icons-react'
import { useNotify } from '../../providers/notifcation_provider'
import { useNavigate, useParams } from 'react-router-dom'
import newCoffeeForm from '../../forms/new_coffee_form'
import { useMutation, useQuery } from 'react-query'
import { useMediaQuery } from '@mantine/hooks'
import Heading from '../../components/heading'
import { firebaseFetchRoasters } from '../../firebase/api/roasters'
import { optimizeCoffeeDescription } from '../../firebase/api/cloud_functions'
import { firebaseFetchRegions } from '../../firebase/api/regions'

const FileInputValue = ({ value }) => {
  if (!value) return null
  // if in the 'edit' flow, the value is gonna be a cloudinary url so take the 'name' bit of the url
  const name = typeof value === 'string' ? value.split('/').pop() : value.name

  return <Pill maw="75%">{name}</Pill>
}

export default function CoffeeEditor() {
  const { notify } = useNotify()
  const navigate = useNavigate()
  const { id } = useParams()
  const form = useForm(newCoffeeForm)
  const isMobile = useMediaQuery('(max-width: 50em)')
  const [imagePreview, setImagePreview] = useState(null)

  const { data: regions, isLoading: loadingRegions } = useQuery(['regions'], firebaseFetchRegions)
  const { data: roasters, isLoading: loadingRoasters } = useQuery(['roasters'], firebaseFetchRoasters)

  const { isLoading: loadingCoffee } = useQuery([`coffee-${id}`], () => firebaseFetchCoffeeForEdit(id), { onSuccess: form.setValues, enabled: !!id })
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

  const { mutate: optimizeDescription, isLoading: isOptimizing } = useMutation(['optimize-description'], optimizeCoffeeDescription, {
    onSuccess: (optimizedDescription) => {
      form.setFieldValue('about', optimizedDescription)
      notify('success', 'Description optimized successfully!')
    },
    onError: () => notify('error', 'Failed to optimize description'),
  })

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
    // fun one, gboard on android/ios won't show correct event keys/key codes so we need to check for commas manually
    // https://issues.chromium.org/issues/41368867
    if (event.key === ','  || event.type === 'blur' || event.target.value.endsWith(',')) {
      const note = event.target.value.trim().replace(',', '')
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
    if (!file) return form.setFieldValue('image', null)

    form.setFieldValue('image', file)
    const objectURL = URL.createObjectURL(file)
    setImagePreview(objectURL)
  }

  return (
    <Stack align="center" mt="150">
      <Heading icon={id ? IconEditCircle : IconCirclePlus} title={`${id ? 'EDIT' : 'NEW'} COFFEE`} />

      <Paper radius="lg" shadow="md" w={isMobile ? '92%' : '75%'} h="30%" mah="30%">
        <LoadingOverlay visible={(Boolean(id) && loadingCoffee) || loadingSave} />

        <SimpleGrid cols={{ sm: 1, md: 2 }} spacing={0}>
          <Center>
            <Image
              style={{ borderRadius: isMobile ? '16px 16px 0px 0px' : '16px 0px 0px 16px' }}
              h="100%"
              mah="640px"
              fit="cover"
              fallbackSrc="https://placehold.co/520x520?text=Coffee+Image"
              src={imagePreview ?? form.getValues().image}
            />
          </Center>
          <Stack p="20px">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Coffee Name"
                placeholder="Coffee Name"
                withAsterisk
                key={form.key('name')}
                {...form.getInputProps('name')}
              />
              <Group justify="space-between" align="center" mt="md">
                <Text size="sm" fw={500}>About</Text>
                <Button
                  variant="subtle"
                  leftSection={<IconWand size={16} />}
                  onClick={() => optimizeDescription(form.getValues())}
                  disabled={!form.getValues().name || !form.getValues().regions?.length || !form.getValues().flavour_notes?.length || isOptimizing}
                  size="compact-sm"
                  fw={500}
                  loading={isOptimizing}
                >
                  Optimize
                </Button>
              </Group>
              <Textarea
                resize="vertical"
                minRows={4}
                autosize
                placeholder="About the coffee"
                withAsterisk
                key={form.key('about')}
                {...form.getInputProps('about')}
              />
              <Select
                withAsterisk
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
                withAsterisk
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
                    onBlur={handleAddNote}
                    onInput={handleAddNote}
                  />
                </Pill.Group>
              </PillsInput>

              <MultiSelect
                withAsterisk
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
                clearable
              />
              <Group justify="flex-end" mt="xl">
                <Button type="submit">Submit</Button>
              </Group>
            </form>
          </Stack>
        </SimpleGrid>
      </Paper>
    </Stack>
  )
}
