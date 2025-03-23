/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import { Notifications, notifications } from '@mantine/notifications'
import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react'

const NOTIFY_MAP = {
  error: {
    icon: <IconX />,
    color: 'red',
  },
  success: {
    icon: <IconCheck />,
    color: 'green',
  },
  info: {
    icon: <IconInfoCircle />,
    color: 'blue',
  },
}

const NotificationContext = createContext({
  notify: (type, title, message) => {},
  clearNotifcations: () => {},
})

export const useNotify = () => useContext(NotificationContext)

export const notify = (type, title, message) => {
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

export const NotifcationProvider = ({ children }) => {

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
