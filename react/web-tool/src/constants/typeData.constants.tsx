export const FIELD_CATEGORIES = [
  {
    name: 'Personal',
    types: [
      { value: 'firstName', label: 'First Name' },
      { value: 'lastName', label: 'Last Name' },
      { value: 'fullName', label: 'Full Name' },
      { value: 'age', label: 'Age' },
      { value: 'gender', label: 'Gender' },
    ],
  },
  {
    name: 'Contact',
    types: [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'address', label: 'Address' },
      { value: 'city', label: 'City' },
      { value: 'country', label: 'Country' },
    ],
  },
  {
    name: 'Dates & Numbers',
    types: [
      { value: 'date', label: 'Date' },
      { value: 'number', label: 'Number' },
      { value: 'boolean', label: 'Boolean' },
    ],
  },
  {
    name: 'Identifiers',
    types: [
      { value: 'id', label: 'UUID' },
      { value: 'custom', label: 'Custom' },
    ],
  },
  {
    name: 'Structured Types',
    types: [
      { value: 'object', label: 'Object' },
      { value: 'array', label: 'Array' },
    ],
  },
];