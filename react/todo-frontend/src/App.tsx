import { Layout, Typography } from 'antd'
import { NotificationModal } from './components/NotificationModal'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { NotificationContext } from './context/NotificationContext'
import { useNotification } from './hooks/useNotification'

const { Header, Content } = Layout
const { Title } = Typography

const App = () => {

  const { showSuccess, showError, notificationProps } = useNotification()

  return (
    <NotificationContext.Provider value={{ showSuccess, showError }}>
      <Layout className="min-h-screen">
        <Header className="bg-white shadow">
          <Title level={2} className="mt-4">
            GraphQL Todo App
          </Title>
        </Header>
        <Content className="p-4">
          <div className="max-w-md mx-auto">
            <TodoForm />
            <TodoList />
          </div>
        </Content>
      </Layout>
      <NotificationModal {...notificationProps} />
    </NotificationContext.Provider>
  )
}

export default App