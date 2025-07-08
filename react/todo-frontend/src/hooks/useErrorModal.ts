import { useState } from 'react'

export const useErrorModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const showError = (message: string) => {
    setErrorMessage(message)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setErrorMessage('')
  }

  return {
    isOpen,
    errorMessage,
    showError,
    closeModal,
  }
}