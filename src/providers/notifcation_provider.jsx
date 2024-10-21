import { createContext, useContext } from 'react'
import { Notifications, notifications } from '@mantine/notifications'

const NOTIFY_COLOR_MAP = {
  info: 'blue',
  error: 'red',
  success: 'green',
  warning: 'yellow',
}

const NotificationContext = createContext({
  notify: (type, title, message) => {},
  clearNotifcations: () => {},
})

// eslint-disable-next-line react-refresh/only-export-components
export const useNotify = () => useContext(NotificationContext)

export const NotifcationProvider = ({ children }) => {
  const notify = (type, title, message) => {
    const color = NOTIFY_COLOR_MAP[type]
    return notifications.show({
      color,
      message,
      title,
      radius: 'lg',
      position: 'bottom-right',
    })
  }

  const clearNotifcations = () => {
    return notifications.clean()
  }

  const value = { notify, clearNotifcations }

  return (
    <>
      <Notifications />
      <NotificationContext.Provider value={value}>
        {children}
      </NotificationContext.Provider>
    </>
  )
}
