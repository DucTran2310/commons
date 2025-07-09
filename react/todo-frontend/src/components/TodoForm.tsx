import { Alert, Button, DatePicker, Form, Input, Select, Tag } from 'antd';
import dayjs from 'dayjs';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React from 'react';
import { useTodos } from '../hooks/useTodos';
import { Priority } from '../todo.types';

const { Option } = Select;
const { TextArea } = Input;

const priorityOptions = [
  { value: Priority.Low, label: 'LOW' },
  { value: Priority.Medium, label: 'MEDIUM' },
  { value: Priority.High, label: 'HIGH' },
];

const tagRender = (props: CustomTagProps) => {
  const { label, closable, onClose } = props;
  return (
    <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
      {label}
    </Tag>
  );
};

export const TodoForm: React.FC = () => {
  const [form] = Form.useForm();
  const { createTodo, isCreating, createError } = useTodos();

  const handleSubmit = (values: {
    title: string;
    priority?: Priority;
    tags?: string[];
    dueDate?: dayjs.Dayjs;
  }) => {
    createTodo({
      title: values.title,
      priority: values.priority,
      tags: values.tags,
      dueDate: values.dueDate?.toISOString(),
      completed: false,
    }, {
      onSuccess: () => form.resetFields()
    });
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please enter a title' }]}
      >
        <TextArea placeholder="What needs to be done?" rows={2} />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.Item name="priority" label="Priority">
          <Select placeholder="Select priority">
            {priorityOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="dueDate" label="Due Date">
          <DatePicker 
            style={{ width: '100%' }} 
            disabledDate={(current) => current && current < dayjs().startOf('day')}
            showTime
          />
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Add tags"
            tagRender={tagRender}
          />
        </Form.Item>
      </div>

      {createError && (
        <Alert
          message="Error"
          description={createError.message}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={isCreating}
          disabled={isCreating}
        >
          Add Todo
        </Button>
      </Form.Item>
    </Form>
  );
};