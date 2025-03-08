import { createContext, useContext } from 'react'
import { Notifications, notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'

const NOTIFY_MAP = {
  error: {
    icon: <IconX />,
    color: 'red',
  },
  success: {
    icon: <IconCheck />,
    color: 'green',
  },
}

const NotificationContext = createContext({
  notify: (type, title, message) => {},
  clearNotifcations: () => {},
})

// eslint-disable-next-line react-refresh/only-export-components
export const useNotify = () => useContext(NotificationContext)

export const NotifcationProvider = ({ children }) => {
  const notify = (type, title, message) => {
    const { color, icon } = NOTIFY_MAP[type]
    return notifications.show({
      color,
      icon,
      message,
      title,
      radius: 'xl',
      position: 'bottom-right',
      withBorder: true,
      autoClose: 4000,
      styles: () => ({
        title: {
          fontSize: '20px',
          fontWeight: 'bold',
        },
        description: {
          fontSize: '18px',
        },
      }),
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
