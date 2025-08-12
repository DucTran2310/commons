import { v1, v4, v5 } from 'uuid';
import { customAlphabet } from 'nanoid';
import type { OutputFormat, UUIDResult, UUIDVersion } from '@/types/uuid.types';

// Polyfill for UUID v7 (sortable timestamp-based)
function v7(): string {
  const unixTs = Date.now();
  const tsHex = Math.floor(unixTs / 1000).toString(16).padStart(8, '0');
  const rand = customAlphabet('1234567890abcdef', 24)();
  return `${tsHex}-${rand.substr(0, 4)}-${rand.substr(4, 4)}-${rand.substr(8, 4)}-${rand.substr(12)}`;
}

export function generateUUID(version: UUIDVersion, namespace?: string, name?: string): string {
  switch (version) {
    case 'v1':
      return v1();
    case 'v4':
      return v4();
    case 'v5':
      if (!namespace || !name) throw new Error('Namespace and name are required for v5');
      return v5(name, namespace);
    case 'v7':
      return v7();
    default:
      return v4();
  }
}

export function formatUUID(uuid: string, format: OutputFormat): string {
  switch (format) {
    case 'no-dashes':
      return uuid.replace(/-/g, '');
    case 'base64':
      return Buffer.from(uuid).toString('base64');
    case 'hex':
      return Buffer.from(uuid.replace(/-/g, ''), 'hex').toString('hex');
    case 'url-safe':
      return uuid.replace(/\//g, '_').replace(/\+/g, '-');
    default:
      return uuid;
  }
}

export function exportToCSV(uuids: UUIDResult[]): string {
  return uuids.map(u => u.uuid).join('\n');
}

export function exportToTXT(uuids: UUIDResult[]): string {
  return uuids.map(u => u.uuid).join('\n');
}

export async function exportToZip(uuids: UUIDResult[]) {
  const JSZip = (await import('jszip')).default;
  const { saveAs } = (await import('file-saver'));
  
  const zip = new JSZip();
  zip.file('uuids.txt', exportToTXT(uuids));
  zip.file('uuids.csv', exportToCSV(uuids));
  
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'uuids.zip');
}