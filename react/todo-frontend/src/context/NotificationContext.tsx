import { createContext, useContext } from 'react'

type NotificationContextType = {
  showSuccess: (title: string, message: string) => void
  showError: (title: string, message: string) => void
}

export const NotificationContext = createContext<NotificationContextType>({
  showSuccess: () => {},
  showError: () => {},
})

export const useNotificationContext = () => useContext(NotificationContext)