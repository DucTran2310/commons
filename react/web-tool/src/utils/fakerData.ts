import { faker } from '@faker-js/faker';
import type { Field } from '@/types/fakeData.types';

export function generateFakeData(fields: Field[], count: number): Record<string, any>[] {
  return Array.from({ length: count }, () => generateRecord(fields));
}

function generateRecord(fields: Field[]): Record<string, any> {
  const record: Record<string, any> = {};
  
  fields.forEach((field) => {
    const options = field.options || '';
    const isEmpty = options.includes('% NULL') && Math.random() < parseFloat(options) / 100;
    
    if (isEmpty) {
      record[field.name] = null;
      return;
    }

    switch (field.type) {
      case 'id':
        record[field.name] = faker.string.uuid();
        break;
      case 'firstName':
        record[field.name] = faker.person.firstName();
        break;
      case 'lastName':
        record[field.name] = faker.person.lastName();
        break;
      case 'fullName':
        record[field.name] = faker.person.fullName();
        break;
      case 'age': {
        const ageRange = options.match(/(\d+)-(\d+)/);
        const min = ageRange ? parseInt(ageRange[1]) : 18;
        const max = ageRange ? parseInt(ageRange[2]) : 65;
        record[field.name] = faker.number.int({ min, max });
        break;
      }
      case 'email': {
        const domain = options.match(/@(.+)/)?.[1] || 'example.com';
        record[field.name] = faker.internet.email({ provider: domain });
        break;
      }
      case 'phone':
        record[field.name] = faker.phone.number();
        break;
      case 'gender':
        record[field.name] = faker.person.sex();
        break;
      case 'date': {
        const dateRange = options.match(/(\d+)-(\d+)/);
        const from = dateRange ? new Date().getFullYear() - parseInt(dateRange[2]) : 10;
        const to = dateRange ? new Date().getFullYear() - parseInt(dateRange[1]) : 0;
        record[field.name] = faker.date.past({ years: to, refDate: from }).toISOString().split('T')[0];
        break;
      }
      case 'boolean':
        record[field.name] = faker.datatype.boolean();
        break;
      case 'number': {
        const numRange = options.match(/(\d+)-(\d+)/);
        const numMin = numRange ? parseInt(numRange[1]) : 0;
        const numMax = numRange ? parseInt(numRange[2]) : 100;
        record[field.name] = faker.number.int({ min: numMin, max: numMax });
        break;
      }
      case 'address':
        record[field.name] = faker.location.streetAddress();
        break;
      case 'city':
        record[field.name] = faker.location.city();
        break;
      case 'country':
        record[field.name] = faker.location.country();
        break;
      case 'custom':
        record[field.name] = options;
        break;
      case 'object':
        if (field.fields) {
          record[field.name] = generateRecord(field.fields);
        } else {
          record[field.name] = {};
        }
        break;
      case 'array':
        if (field.fields) {
          const arrayLength = faker.number.int({ min: 1, max: 5 });
          record[field.name] = Array.from({ length: arrayLength }, () => 
            generateRecord(field.fields!)
          );
        } else {
          const arrayLength = faker.number.int({ min: 1, max: 10 });
          const primitiveType = options || 'string';
          record[field.name] = Array.from({ length: arrayLength }, () => 
            generatePrimitive(primitiveType, options)
          );
        }
        break;
      default:
        record[field.name] = generatePrimitive(field.type, options);
    }
  });
  
  return record;
}

function generatePrimitive(type: string, options: string = ''): any {
  switch (type) {
    case 'string': return faker.lorem.word();
    case 'number': return faker.number.int();
    case 'boolean': return faker.datatype.boolean();
    default: return '';
  }
}

export function generateCSV(data: Record<string, any>[], fields: Field[]): string {
  const flattenedFields = flattenFields(fields);
  const headers = flattenedFields.map(f => f.name).join(',');
  const rows = data.map(row => 
    flattenedFields.map(field => {
      const value = getNestedValue(row, field.originalPath || field.name);
      if (value === null || value === undefined) return '';
      return `"${value.toString().replace(/"/g, '""')}"`;
    }).join(',')
  ).join('\n');
  
  return `${headers}\n${rows}`;
}

function flattenFields(fields: Field[], prefix = ''): Array<{name: string, originalPath: string}> {
  let result: Array<{name: string, originalPath: string}> = [];
  
  fields.forEach(field => {
    if (field.type === 'object' && field.fields) {
      result = [...result, ...flattenFields(field.fields, `${prefix}${field.name}.`)];
    } else if (field.type === 'array' && field.fields) {
      result = [...result, ...flattenFields(field.fields, `${prefix}${field.name}[0].`)];
    } else {
      result.push({
        name: `${prefix}${field.name}`,
        originalPath: `${prefix}${field.name}`
      });
    }
  });
  
  return result;
}

function getNestedValue(obj: any, path: string): any {
  return path.split(/[.[\]]+/).filter(Boolean).reduce((acc, part) => {
    if (acc && typeof acc === 'object') {
      return acc[part];
    }
    return undefined;
  }, obj);
}

export function generateJSON(data: Record<string, any>[]): string {
  return JSON.stringify(data, null, 2);
}