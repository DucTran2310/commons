import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout, Typography } from 'antd';
import 'antd/dist/reset.css';
import React from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import './index.css';
import { apolloClient } from './libs/apollo-client';

const { Header, Content } = Layout;
const { Title } = Typography;

const TodoApp: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </ApolloProvider>
  );
};

export default TodoApp;