import {
  Button,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { firebaseAddRoaster, firebaseFetchRoaster, firebaseUpdateRoaster  } from '../../firebase/api/roasters'
import { useState } from 'react'
import { IconCirclePlus, IconEditCircle } from '@tabler/icons-react'
import { useNotify } from '../../providers/notifcation_provider'
import { useNavigate, useParams } from 'react-router-dom'
import newRoasterForm from '../../forms/new_roaster_form'
import { useMutation, useQuery } from 'react-query'
import { useMediaQuery } from '@mantine/hooks'
import { Heading } from '../../components/layout'
import ImageUpload from '../../components/image_upload'

export default function RoasterEditor() {
  const { notify } = useNotify()
  const navigate = useNavigate()
  const { id } = useParams()
  const form = useForm(newRoasterForm)
  const isMobile = useMediaQuery('(max-width: 50em)')
  const [imagePreview, setImagePreview] = useState(null)
  const { data: roaster, isLoading: loadingRoaster } = useQuery([`roaster-${id}`], () => firebaseFetchRoaster(id), { onSuccess: form.setValues, enabled: !!id })
  const { mutate: saveRoaster, isLoading: loadingSave } = useMutation(
    id ? ['update-roaster'] : ['add-roaster'],
    id ? firebaseUpdateRoaster : firebaseAddRoaster,
    {
      onSuccess: () => {
        notify('success', `Roaster ${id ? 'updated' : 'added'} successfully!`)
        navigate(id ? '/admin/roasters' : '/roasters')
      },
    },
  )

  const handleSubmit = async (submittedRoaster) => {
    if (!id) return saveRoaster(submittedRoaster)
    saveRoaster({ ...submittedRoaster })
  }

  return (
    <Stack align="center" mt="150">
      <Heading icon={id ? IconEditCircle : IconCirclePlus} title={`${id ? 'EDIT' : 'NEW'} ROASTER`} />

      <Paper radius="lg" shadow="md" w={isMobile ? '92%' : '75%'} h="30%" mah="30%">
        <LoadingOverlay visible={(Boolean(id) && loadingRoaster) || loadingSave} />

        <SimpleGrid cols={{ sm: 1, md: 2 }} spacing={0}>
          <Image
            style={{ borderRadius: isMobile ? '16px 16px 0px 0px' : '16px 0px 0px 16px' }}
            h="100%"
            fit="cover"
            fallbackSrc="https://placehold.co/520x520?text=Roaster+Image"
            src={imagePreview ?? form.getValues().image}
          />
          <Stack p="20px">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Roaster Name"
                placeholder="Roaster Name"
                withAsterisk
                key={form.key('name')}
                {...form.getInputProps('name')}
              />

              <Textarea
                mt="md"
                label="About"
                placeholder="About the roaster"
                withAsterisk
                key={form.key('about')}
                {...form.getInputProps('about')}
              />

              <TextInput
                mt="md"
                label="Roaster Location"
                placeholder="Roaster Location"
                withAsterisk
                key={form.key('location')}
                {...form.getInputProps('location')}
              />

              <TextInput
                mt="md"
                label="Roaster Website"
                placeholder="Roaster Website"
                withAsterisk
                key={form.key('website')}
                {...form.getInputProps('website')}
              />

              <ImageUpload form={form} onUpdateImage={(url) => setImagePreview(url)} originalImage={roaster?.image} />

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
