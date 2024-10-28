import { useQuery } from 'react-query'
import { useNotify } from '../providers/notifcation_provider'

// just a small wrapper to always fire a notification when an error is hit
export default function useCustomQuery(queryKey, queryFn, queryOpts) {
  const notify = useNotify()
  return useQuery({
    ...queryOpts,
    queryKey,
    queryFn,
    onError: (err) =>
      notify(
        'Error',
        'There was an error with your request',
        err?.message ?? 'Unknown Error',
      ),
  })
}
