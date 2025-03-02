import { useMutation } from 'react-query'
import { useNotify } from '../providers/notifcation_provider'

export default function useCustomMutation(mutationKey, mutationFn, options = {}) {
  const { notify } = useNotify()

  return useMutation({
    mutationKey,
    mutationFn,
    ...options,
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) return options.onSuccess()
      notify('success', 'Your request was successful!')
      options.onSuccess?.(data, variables, context)
    },
    onError: (err, variables, context) => {
      if (options?.onError) return options.onError()
      notify(
        'error',
        'There was an error with your request',
        err?.message ?? 'Unknown Error',
      )
      options.onError?.(err, variables, context)
    },
  })
}
