import { Alert, Button, DatePicker, Form, Input, Select, Tag, Space, Tooltip } from 'antd';
import dayjs from 'dayjs';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React from 'react';
import { useTodos } from '../hooks/useTodos';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { Priority } from '../todo.types';

const { Option } = Select;
const { TextArea } = Input;

const priorityOptions = [
  { value: 'LOW' as Priority, label: 'Low', color: 'green' },
  { value: 'MEDIUM' as Priority, label: 'Medium', color: 'orange' },
  { value: 'HIGH' as Priority, label: 'High', color: 'red' },
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
      tags: values.tags?.filter(tag => tag.trim() !== ''),
      dueDate: values.dueDate?.toISOString(),
      completed: false,
    }, {
      onSuccess: () => form.resetFields()
    });
  };

  return (
    <Form 
      form={form} 
      onFinish={handleSubmit} 
      layout="vertical"
      initialValues={{ priority: 'MEDIUM' }}
    >
      <Form.Item
        name="title"
        label={
          <Space>
            Title
            <Tooltip title="Enter a descriptive title for your todo">
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          </Space>
        }
        rules={[
          { required: true, message: 'Please enter a title' },
          { max: 100, message: 'Title cannot exceed 100 characters' }
        ]}
      >
        <TextArea 
          placeholder="What needs to be done?" 
          rows={2} 
          showCount 
          maxLength={100}
          allowClear
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.Item 
          name="priority" 
          label="Priority"
          tooltip="Set the importance level of this task"
        >
          <Select placeholder="Select priority">
            {priorityOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>
                <Tag color={opt.color}>{opt.label}</Tag>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          name="dueDate" 
          label="Due Date"
          tooltip="Set a deadline for this task"
        >
          <DatePicker 
            style={{ width: '100%' }} 
            disabledDate={(current) => current && current < dayjs().startOf('day')}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder="Select date and time"
          />
        </Form.Item>

        <Form.Item 
          name="tags" 
          label="Tags"
          tooltip="Add keywords to help categorize your tasks"
          rules={[
            { 
              validator: (_, tags) => {
                if (tags && tags.some((tag: string) => tag.length > 20)) {
                  return Promise.reject(new Error('Tags cannot exceed 20 characters'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Add tags (max 20 chars each)"
            tagRender={tagRender}
            tokenSeparators={[',', ' ']}
            maxTagCount={5}
            maxTagTextLength={20}
          />
        </Form.Item>
      </div>

      {createError && (
        <Alert
          message="Error"
          description={createError.message}
          type="error"
          showIcon
          closable
          className="mb-4"
        />
      )}

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={isCreating}
          disabled={isCreating}
          size="large"
          block
        >
          {isCreating ? 'Adding...' : 'Add Todo'}
        </Button>
      </Form.Item>
    </Form>
  );
};