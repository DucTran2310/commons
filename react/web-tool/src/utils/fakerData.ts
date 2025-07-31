import type { Field } from '@/types/fakeData.types';
import { faker } from '@faker-js/faker';

// Enhanced Data Generation
export const generateFakeData = (fields: Field[], count: number): Record<string, any>[] => {
  const uniqueValues = new Map<string, Set<any>>();
  
  // Validate fields before generation
  if (fields.some(field => !field.name.trim())) {
    throw new Error('Field names cannot be empty');
  }
  
  // Reset unique values for each generation
  uniqueValues.clear();
  
  return Array.from({ length: count }, (_, index) => {
    return generateRecord(fields, uniqueValues, index);
  });
};

export const generateRecord = (fields: Field[], uniqueValues: Map<string, Set<any>>, index: number): Record<string, any> => {
  const record: Record<string, any> = {};
  
  fields.forEach((field) => {
    const options = field.options || '';
    const nullMatch = options.match(/(\d+)% NULL/);
    const nullPercentage = nullMatch ? parseFloat(nullMatch[1]) : 0;
    
    // Apply null percentage
    if (nullPercentage > 0 && Math.random() < nullPercentage / 100) {
      record[field.name] = null;
      return;
    }

    let value = generateFieldValue(field, options, index);
    
    // Handle unique values
    if (field.unique) {
      if (!uniqueValues.has(field.name)) {
        uniqueValues.set(field.name, new Set());
      }
      const usedValues = uniqueValues.get(field.name)!;
      let attempts = 0;
      while (usedValues.has(value) && attempts < 100) {
        value = generateFieldValue(field, options, index + attempts);
        attempts++;
      }
      
      if (attempts >= 100) {
        console.warn(`Failed to generate unique value for field ${field.name} after 100 attempts`);
      }
      
      usedValues.add(value);
    }
    
    record[field.name] = value;
  });
  
  return record;
};

export const generateFieldValue = (field: Field, options: string, seed: number): any => {
  // Remove null percentage from options
  const cleanOptions = options.replace(/\d+% NULL,?\s?/, '').trim();
  
  // Seed faker for consistent results
  faker.seed(seed);
  
  try {
    switch (field.type) {
      case 'id':
        return faker.string.uuid();
      case 'firstName':
        return faker.person.firstName();
      case 'lastName':
        return faker.person.lastName();
      case 'fullName':
        return faker.person.fullName();
      case 'jobTitle':
        return faker.person.jobTitle();
      case 'age': {
        const range = cleanOptions.match(/(\d+)-(\d+)/);
        const min = range ? parseInt(range[1]) : 18;
        const max = range ? parseInt(range[2]) : 65;
        return applyDistribution(field.distribution, min, max, seed);
      }
      case 'email': {
        const domain = cleanOptions || 'example.com';
        return faker.internet.email({ provider: domain });
      }
      case 'phone':
        return faker.phone.number();
      case 'gender':
        return faker.person.sex();
      case 'date': {
        const range = cleanOptions.match(/(\d+)-(\d+)/);
        const years = range ? parseInt(range[1]) : 1;
        return faker.date.past({ years }).toISOString().split('T')[0];
      }
      case 'boolean':
        return faker.datatype.boolean();
      case 'number': {
        const range = cleanOptions.match(/(\d+)-(\d+)/);
        const min = range ? parseInt(range[1]) : 0;
        const max = range ? parseInt(range[2]) : 100;
        return applyDistribution(field.distribution, min, max, seed);
      }
      case 'currency': {
        const range = cleanOptions.match(/(\d+)-(\d+)/);
        const min = range ? parseInt(range[1]) : 10;
        const max = range ? parseInt(range[2]) : 1000;
        return `$${faker.number.int({ min, max }).toFixed(2)}`;
      }
      case 'creditCard':
        return faker.finance.creditCardNumber();
      case 'image':
        return `https://picsum.photos/300/200?random=${seed}`;
      case 'color':
        return faker.internet.color();
      case 'address':
        return faker.location.streetAddress();
      case 'city':
        return faker.location.city();
      case 'country':
        return faker.location.country();
      case 'custom': {
        if (cleanOptions.includes(',')) {
          const choices = cleanOptions.split(',').map(s => s.trim());
          return faker.helpers.arrayElement(choices);
        }
        return cleanOptions || faker.lorem.word();
      }
      case 'string':
        if (field.pattern) {
          try {
            return faker.helpers.fromRegExp(new RegExp(field.pattern));
          } catch (e) {
            console.error(`Invalid regex pattern for field ${field.name}: ${field.pattern}`);
            return 'INVALID_PATTERN';
          }
        }
        return faker.lorem.words();
      case 'object':
        return field.fields ? generateRecord(field.fields, new Map(), seed) : {};
      case 'array': {
        const length = faker.number.int({ min: 1, max: 5 });
        if (field.fields) {
          return Array.from({ length }, (_, i) => generateRecord(field.fields!, new Map(), seed + i));
        }
        return Array.from({ length }, () => faker.lorem.word());
      }
      default:
        return faker.lorem.word();
    }
  } catch (error) {
    console.error(`Error generating value for field ${field.name} (type: ${field.type})`, error);
    return `ERROR_${field.type.toUpperCase()}`;
  }
};

export const applyDistribution = (distribution: string | undefined, min: number, max: number, seed: number): number => {
  if (min > max) [min, max] = [max, min]; // Ensure min <= max
  
  switch (distribution) {
    case 'normal': {
      const mean = (min + max) / 2;
      const stdDev = (max - min) / 6;
      let value = faker.number.int({ min, max });
      // Simple normal distribution approximation
      for (let i = 0; i < 12; i++) {
        value += Math.random();
      }
      value = Math.round((value - 6) * stdDev + mean);
      return Math.max(min, Math.min(max, value));
    }
    case 'exponential':
      return Math.round(min + (max - min) * (1 - Math.exp(-Math.random() * 2)));
    default:
      return faker.number.int({ min, max });
  }
};

// Helper Functions
export const generateCSV = (data: Record<string, any>[], fields: Field[]): string => {
  const headers = fields
    .filter(f => !hasObjectOrArrayField([f])) // Exclude complex fields
    .map(f => f.name)
    .join(',');
  
  const rows = data.map(row => 
    fields
      .filter(f => !hasObjectOrArrayField([f])) // Exclude complex fields
      .map(field => {
        const value = row[field.name];
        if (value === null || value === undefined) return '';
        return `"${value.toString().replace(/"/g, '""')}"`;
      })
      .join(',')
  ).join('\n');
  
  return `${headers}\n${rows}`;
};

export const generateJSON = (data: Record<string, any>[]): string => {
  return JSON.stringify(data, null, 2);
};

export const hasObjectOrArrayField = (fields: Field[]): boolean => {
  return fields.some(field => 
    field.type === 'object' || 
    field.type === 'array' ||
    (field.fields && hasObjectOrArrayField(field.fields))
  );
};