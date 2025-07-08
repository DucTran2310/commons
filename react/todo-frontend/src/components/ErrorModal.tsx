import { Modal, Button } from 'antd'

export const ErrorModal = ({
  isOpen,
  message,
  onClose,
}: {
  isOpen: boolean
  message: string
  onClose: () => void
}) => {
  return (
    <Modal
      title="Error"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <p>{message}</p>
    </Modal>
  )
}