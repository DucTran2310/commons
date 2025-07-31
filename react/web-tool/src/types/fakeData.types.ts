// Enhanced Types
export type FieldType = 
  | 'id' | 'firstName' | 'lastName' | 'fullName' | 'age' | 'email' | 'phone'
  | 'gender' | 'date' | 'boolean' | 'number' | 'address' | 'city' | 'country'
  | 'custom' | 'object' | 'array' | 'string' | 'image' | 'color' | 'creditCard'
  | 'currency' | 'jobTitle';

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  options?: string;
  fields?: Field[];
  unique?: boolean;
  pattern?: string;
  distribution?: 'uniform' | 'normal' | 'exponential';
}

export interface Template {
  id: string;
  name: string;
  description: string;
  fields: Field[];
  isBuiltIn?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Field Categories with enhanced descriptions
export const FIELD_CATEGORIES = [
  {
    name: 'Personal',
    types: [
      { value: 'firstName', label: 'First Name', description: 'Random first names' },
      { value: 'lastName', label: 'Last Name', description: 'Random last names' },
      { value: 'fullName', label: 'Full Name', description: 'Combined first and last name' },
      { value: 'age', label: 'Age', description: 'Age in years (18-65)' },
      { value: 'gender', label: 'Gender', description: 'Male or Female' },
      { value: 'jobTitle', label: 'Job Title', description: 'Professional job titles' },
    ],
  },
  {
    name: 'Contact',
    types: [
      { value: 'email', label: 'Email', description: 'Valid email addresses' },
      { value: 'phone', label: 'Phone', description: 'Phone numbers' },
      { value: 'address', label: 'Address', description: 'Street addresses' },
      { value: 'city', label: 'City', description: 'City names' },
      { value: 'country', label: 'Country', description: 'Country names' },
    ],
  },
  {
    name: 'Financial',
    types: [
      { value: 'creditCard', label: 'Credit Card', description: 'Credit card numbers' },
      { value: 'currency', label: 'Currency', description: 'Currency amounts' },
    ],
  },
  {
    name: 'Media & Design',
    types: [
      { value: 'image', label: 'Image URL', description: 'Image URLs from placeholder services' },
      { value: 'color', label: 'Color', description: 'Hex color codes' },
    ],
  },
  {
    name: 'Dates & Numbers',
    types: [
      { value: 'date', label: 'Date', description: 'Random dates' },
      { value: 'number', label: 'Number', description: 'Numeric values' },
      { value: 'boolean', label: 'Boolean', description: 'True or false values' },
    ],
  },
  {
    name: 'Identifiers',
    types: [
      { value: 'id', label: 'UUID', description: 'Unique identifiers' },
      { value: 'custom', label: 'Custom', description: 'Custom values' },
      { value: 'string', label: 'String', description: 'Random text strings' },
    ],
  },
  {
    name: 'Structured Types',
    types: [
      { value: 'object', label: 'Object', description: 'Nested objects' },
      { value: 'array', label: 'Array', description: 'Arrays of values' },
    ],
  },
];

// Built-in Templates
export const BUILT_IN_TEMPLATES: Template[] = [
  {
    id: 'user-template',
    name: 'User Profile',
    description: 'Basic user information with contact details',
    isBuiltIn: true,
    fields: [
      { id: '1', name: 'id', type: 'id' },
      { id: '2', name: 'firstName', type: 'firstName' },
      { id: '3', name: 'lastName', type: 'lastName' },
      { id: '4', name: 'email', type: 'email' },
      { id: '5', name: 'age', type: 'age', options: '18-65' },
      { id: '6', name: 'phone', type: 'phone' },
      { id: '7', name: 'address', type: 'address' },
    ]
  },
  {
    id: 'product-template',
    name: 'Product Catalog',
    description: 'E-commerce product data structure',
    isBuiltIn: true,
    fields: [
      { id: '1', name: 'productId', type: 'id' },
      { id: '2', name: 'name', type: 'custom', options: 'Product Name' },
      { id: '3', name: 'price', type: 'currency', options: '10-1000' },
      { id: '4', name: 'description', type: 'string' },
      { id: '5', name: 'imageUrl', type: 'image' },
      { id: '6', name: 'inStock', type: 'boolean' },
      { id: '7', name: 'category', type: 'custom', options: 'Electronics,Clothing,Books,Home' },
    ]
  },
  {
    id: 'order-template',
    name: 'Order Management',
    description: 'Order and transaction data',
    isBuiltIn: true,
    fields: [
      { id: '1', name: 'orderId', type: 'id' },
      { id: '2', name: 'customerId', type: 'id' },
      { id: '3', name: 'orderDate', type: 'date' },
      { id: '4', name: 'totalAmount', type: 'currency', options: '20-500' },
      { id: '5', name: 'status', type: 'custom', options: 'pending,shipped,delivered,cancelled' },
      { id: '6', name: 'paymentMethod', type: 'creditCard' },
    ]
  },
  {
    id: 'social-media-template',
    name: 'Social Media',
    description: 'User posts and interactions',
    isBuiltIn: true,
    fields: [
      { id: '1', name: 'userId', type: 'id' },
      { id: '2', name: 'username', type: 'custom', options: 'user123' },
      { id: '3', name: 'post', type: 'string' },
      { id: '4', name: 'likes', type: 'number', options: '0-1000' },
      { id: '5', name: 'comments', type: 'array', fields: [
        { id: '5-1', name: 'userId', type: 'id' },
        { id: '5-2', name: 'text', type: 'string' },
        { id: '5-3', name: 'timestamp', type: 'date' }
      ]},
      { id: '6', name: 'timestamp', type: 'date' }
    ]
  },
  {
    id: 'inventory-template',
    name: 'Inventory',
    description: 'Product stock and warehouse data',
    isBuiltIn: true,
    fields: [
      { id: '1', name: 'productId', type: 'id' },
      { id: '2', name: 'name', type: 'string' },
      { id: '3', name: 'quantity', type: 'number', options: '0-1000' },
      { id: '4', name: 'price', type: 'currency', options: '10-500' },
      { id: '5', name: 'warehouse', type: 'object', fields: [
        { id: '5-1', name: 'location', type: 'string' },
        { id: '5-2', name: 'aisle', type: 'string' },
        { id: '5-3', name: 'shelf', type: 'string' }
      ]},
      { id: '6', name: 'lastStocked', type: 'date' }
    ]
  }
];