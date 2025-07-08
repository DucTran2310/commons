import { Modal } from "antd"
import type { NotificationType } from "../hooks/useNotification"

export const NotificationModal = ({
  isOpen,
  title,
  message,
  type,
  onClose
}: {
  isOpen: boolean
  title: string
  message: string
  type: NotificationType
  onClose: () => void
}) => (
  <Modal
    title={title}
    open={isOpen}
    onCancel={onClose}
    footer={[
      <button 
        key="close" 
        className={`px-4 py-2 rounded ${
          type === 'success' 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-red-500 hover:bg-red-600'
        } text-white`}
        onClick={onClose}
      >
        Close
      </button>,
    ]}
  >
    <div className={`p-4 ${
      type === 'success' 
        ? 'bg-green-50 text-green-700' 
        : 'bg-red-50 text-red-700'
    } rounded`}>
      {message}
    </div>
  </Modal>
)