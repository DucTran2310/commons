
import { useState } from 'react'

export type NotificationType = 'success' | 'error'

export const useNotification = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [type, setType] = useState<NotificationType>('success')

  const showSuccess = (title: string, message: string) => {
    setTitle(title)
    setMessage(message)
    setType('success')
    setIsOpen(true)
  }

  const showError = (title: string, message: string) => {
    setTitle(title)
    setMessage(message)
    setType('error')
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return {
    showSuccess,
    showError,
    closeModal,
    notificationProps: {
      isOpen,
      title,
      message,
      type,
      onClose: closeModal
    }
  }
}