export type FieldType = 
  | 'id' | 'firstName' | 'lastName' | 'fullName' | 'age' | 'email' | 'phone'
  | 'gender' | 'date' | 'boolean' | 'number' | 'address' | 'city' | 'country'
  | 'custom' | 'object' | 'array' | 'string';

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  options?: string;
  fields?: Field[]; // For object and array types
  isArray?: boolean; // To distinguish between object and array of objects
}