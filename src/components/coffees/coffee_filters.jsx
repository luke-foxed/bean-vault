import { ActionIcon, Grid, Loader, Select } from '@mantine/core'
import { useQuery } from 'react-query'
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react'
import { useState } from 'react'
import { firebaseFetchRoasters } from '../../firebase/api/roasters'
import { firebaseFetchRegions } from '../../firebase/api/coffee'

const SORT_OPTIONS = [
  { label: 'Name', value: 'name' },
  { label: 'Date Added', value: 'date_added' },
  { label: 'Score', value: 'score' },
]

export default function CoffeeFilters({ filters, onChangeFilters }) {
  // this sucks a great deal but the damn dropdowns aren't closing on outside click
  const [dropdownsOpened, setDropdownsOpened] = useState({ roaster: false, region: false, sortby: false })
  const { data: roasters, isLoading: loadingRoasters } = useQuery(['roasters'], firebaseFetchRoasters)
  const { data: regions, isLoading: loadingRegions } = useQuery(['regions'], firebaseFetchRegions)

  const sortOrder = filters.get('order') || 'asc'

  return (
    <Grid breakpoints={{ xs: '200px', sm: '250px', md: '600px', lg: '800px', xl: '1400px' }}>
      <Grid.Col span={{ xs: 12, sm: 12, md: 'content' }}>
        <Select
          dropdownOpened={dropdownsOpened.roaster}
          onDropdownOpen={() => setDropdownsOpened({ ...dropdownsOpened, roaster: true })}
          onDropdownClose={() => setDropdownsOpened({ ...dropdownsOpened, roaster: false })}
          onBlur={() => setDropdownsOpened({ ...dropdownsOpened, roaster: false })}
          placeholder="Select by Roaster"
          value={filters.get('roaster') || ''}
          clearable
          rightSection={loadingRoasters && <Loader size="sm" />}
          disabled={loadingRoasters}
          label="Select by Roaster:"
          data={roasters?.map((roaster) => ({ value: roaster.id, label: roaster.name }))}
          onChange={(value) => onChangeFilters('roaster', value)}
        />
      </Grid.Col>
      <Grid.Col span={{ xs: 12, sm: 12, md: 'content' }}>
        <Select
          dropdownOpened={dropdownsOpened.region}
          onDropdownOpen={() => setDropdownsOpened({ ...dropdownsOpened, region: true })}
          onDropdownClose={() => setDropdownsOpened({ ...dropdownsOpened, region: false })}
          onBlur={() => setDropdownsOpened({ ...dropdownsOpened, region: false })}
          placeholder="Select by Region"
          clearable
          value={regions?.find((region) => region.id === filters.get('region'))?.name || ''}
          rightSection={loadingRegions && <Loader size="sm" />}
          disabled={loadingRegions}
          label="Select by Region:"
          data={regions?.map((region) => region.name)}
          onChange={(value) => onChangeFilters('region', regions.find((region) => region.name === value)?.id)}
        />
      </Grid.Col>
      <Grid.Col span={{ xs: 10, sm: 10, md: 'content' }}>
        <Select
          dropdownOpened={dropdownsOpened.sortby}
          onDropdownOpen={() => setDropdownsOpened({ ...dropdownsOpened, sortby: true })}
          onDropdownClose={() => setDropdownsOpened({ ...dropdownsOpened, sortby: false })}
          onBlur={() => setDropdownsOpened({ ...dropdownsOpened, sortby: false })}
          clearable
          value={filters.get('sortBy') || 'name'}
          label="Sort By:"
          data={SORT_OPTIONS}
          onChange={(value) => onChangeFilters('sortBy', value)}
        />
      </Grid.Col>
      <Grid.Col span={{ xs: 2, sm: 2, md: 'content' }}>
        <ActionIcon
          mt="26px"
          size="lg"
          variant="light"
          onClick={() => onChangeFilters('order', sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? <IconSortAscending size={40} /> : <IconSortDescending size={40} />}
        </ActionIcon>
      </Grid.Col>
    </Grid>
  )
}
