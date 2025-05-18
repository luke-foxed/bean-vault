import { Button, Group, Paper, Stack, Text, TextInput, Title, Loader, Select, Grid } from '@mantine/core'
import { IconRobot, IconCheck, IconX, IconAlertCircle, IconRefresh, IconDeviceFloppy } from '@tabler/icons-react'
import { useState } from 'react'
import { useNotify } from '../../providers/notifcation_provider'
import { scrapeAllProducts } from '../../scraper/api'
import { useQuery } from 'react-query'
import { firebaseFetchRoasters } from '../../firebase/api/roasters'
import JsonTree from '../../components/scraper/json_tree'
import { CoffeeCard } from '../../components/coffees'
import { prepareScrapedCoffeesForPreview, writeScrapedCoffeToDB } from '../../scraper/utils'

const handleScraperProgress = (onProgress, update) => {
  onProgress((prev) => {
    if (update.type === 'init') return { message: update.message, urls: [] }
    if (update.type === 'error') return { message: `Error: ${update.message}`, urls: prev.urls }
    if (update.type === 'done') return { message: update.message, urls: prev.urls }

    if (update.type === 'start') {
      const newUrls = [...prev.urls]
      newUrls[update.index] = { url: update.url, status: 'loading' }
      return { ...prev, urls: newUrls }
    }
    if (update.type === 'complete') {
      const newUrls = [...prev.urls]
      newUrls[update.index] = { url: update.url, status: 'success' }
      return { ...prev, urls: newUrls }
    }
    if (update.type === 'skip') {
      const newUrls = [...prev.urls]
      newUrls[update.index] = { url: update.url, status: 'skipped' }
      return { ...prev, urls: newUrls }
    }

    return prev
  })
}

export default function AdminScraper() {
  const { notify } = useNotify()
  const [selectedRoaster, setSelectedRoaster] = useState('')
  const [url, setUrl] = useState('')
  const [shouldFetch, setShouldFetch] = useState(false)
  const [progress, setProgress] = useState({ message: '', urls: [] })
  const [jsonData, setJsonData] = useState('')
  const [previewData, setPreviewData] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  const { data: roasters, isLoading: loadingRoasters } = useQuery(['roasters'], firebaseFetchRoasters)

  const { isLoading: isLoadingScrape } = useQuery(
    ['scrape-coffee', url],
    () => scrapeAllProducts(selectedRoaster, url, (update) => handleScraperProgress(setProgress, update)),
    {
      enabled: shouldFetch && !!url,
      onSuccess: async (data) => {
        notify('success', 'Success', 'Successfully scraped coffee data')
        setJsonData(JSON.stringify(data, null, 2))
        const preview = await prepareScrapedCoffeesForPreview(data, selectedRoaster)
        setPreviewData(preview)
      },
      onError: (error) => notify('error', 'Error', error.message || 'Failed to scrape data'),
      onSettled: () => setShouldFetch(false),
    },
  )

  const getStatusIcon = (status) => {
    switch (status) {
      case 'loading':
        return <Loader size="sm" />
      case 'success':
        return <IconCheck size={16} color="green" />
      case 'skipped':
        return <IconAlertCircle size={16} color="orange" />
      case 'error':
        return <IconX size={16} color="red" />
      default:
        return null
    }
  }

  const handleEditorChange = (value) => {
    try {
      // Validate JSON
      JSON.parse(value)
      setJsonData(value)
    } catch {
      // Invalid JSON, but still update the editor
      setJsonData(value)
    }
  }

  const handleRefreshPreview = async () => {
    try {
      const data = JSON.parse(jsonData)
      const preview = await prepareScrapedCoffeesForPreview(data, selectedRoaster)
      setPreviewData(preview)
      notify('success', 'Success', 'Preview refreshed')
    } catch (error) {
      notify('error', 'Error', error?.message || 'Failed to refresh preview')
    }
  }

  const handleSaveAllCoffees = async () => {
    if (!selectedRoaster || !previewData?.length) return

    setIsSaving(true)
    try {
      await writeScrapedCoffeToDB(selectedRoaster, previewData)
      notify('success', 'Success', 'Successfully saved all coffees')
    } catch (error) {
      notify('error', 'Error', error?.message || 'Failed to save coffees')
    } finally {
      setIsSaving(false)
    }
  }

  const roasterOptions = roasters?.map((roaster) => ({ value: roaster.id, label: roaster.name })) || []

  return (
    <Stack gap="20px">
      <Paper p="20px" radius="lg" withBorder>
        <Stack gap="20px">
          <Title order={3}>Coffee Bean Scraper</Title>
          <Text>
            Select a roaster or enter a URL to scrape coffee bean data from. The scraper will extract information about
            coffee beans including name, roaster, region, image URL, and tasting notes.
          </Text>
          <Group>
            <Select
              placeholder="Select a roaster"
              data={roasterOptions}
              value={selectedRoaster}
              onChange={setSelectedRoaster}
              style={{ width: 200 }}
              disabled={loadingRoasters}
            />
            <TextInput
              placeholder="Enter URL to scrape"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button
              leftSection={<IconRobot />}
              onClick={() => setShouldFetch(true)}
              loading={isLoadingScrape}
              disabled={isLoadingScrape || !url || !selectedRoaster}
            >
              Scrape
            </Button>
          </Group>
          {progress.message && (
            <Text size="sm" c="dimmed">
              {progress.message}
            </Text>
          )}
          {progress.urls.length > 0 && (
            <Stack gap="xs">
              {progress.urls.map((item, index) => (
                <Group key={index} gap="xs">
                  {getStatusIcon(item.status)}
                  <Text size="sm" style={{ flex: 1, wordBreak: 'break-all' }}>
                    {item.url}
                  </Text>
                </Group>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>

      {jsonData && (
        <>
          <Paper p="20px" radius="lg" withBorder>
            <Stack gap="20px">
              <Group justify="space-between">
                <Title order={3}>Scraped Results</Title>
                <Button
                  leftSection={<IconRefresh size={16} />}
                  variant="light"
                  onClick={handleRefreshPreview}
                  disabled={!selectedRoaster}
                >
                  Refresh Preview
                </Button>
              </Group>
              <JsonTree jsonData={jsonData} handleEditorChange={handleEditorChange} />
            </Stack>
          </Paper>

          <Paper p="20px" radius="lg" withBorder>
            <Stack gap="20px">
              <Title order={3}>Preview</Title>
              <Grid
                w="95vw"
                m="auto"
                gutter={{ base: 'sm', sm: 'md', lg: 'xl' }}
                align="center"
                breakpoints={{ xs: '200px', sm: '250px', md: '600px', lg: '800px', xl: '1400px' }}
              >
                {previewData?.length > 0 &&
                  previewData.map((coffee) => (
                    <Grid.Col span={{ base: 12, xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }} key={coffee.id}>
                      <CoffeeCard coffee={coffee} onClick={null} />
                    </Grid.Col>
                  ))}
              </Grid>
              {previewData?.length > 0 && (
                <Group justify="center" mt="md">
                  <Button
                    leftSection={<IconDeviceFloppy size={16} />}
                    onClick={handleSaveAllCoffees}
                    loading={isSaving}
                    disabled={!selectedRoaster}
                  >
                    Save All Coffees
                  </Button>
                </Group>
              )}
            </Stack>
          </Paper>
        </>
      )}
    </Stack>
  )
}
