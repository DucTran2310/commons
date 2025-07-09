import { Layout, Typography } from 'antd'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'

const { Header, Content } = Layout
const { Title } = Typography

const App = () => {

  return (
      <Layout className="min-h-screen">
        <Header className="bg-white shadow">
          <Title level={2} className="mt-4">
            GraphQL Todo App
          </Title>
        </Header>
        <Content className="p-4">
          <div className="max-w-screen-lg mx-auto">
            <TodoForm />
            <TodoList />
          </div>
        </Content>
      </Layout>
  )
}

export default App