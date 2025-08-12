export type UUIDVersion = 'v1' | 'v4' | 'v5' | 'v7';
export type OutputFormat = 'standard' | 'no-dashes' | 'base64' | 'hex' | 'url-safe';

export interface UUIDOptions {
  version: UUIDVersion;
  count: number;
  upperCase: boolean;
  format: OutputFormat;
  autoGenerate: boolean;
  autoGenerateInterval: number;
  namespace?: string;
  name?: string;
}

export interface UUIDResult {
  id: string;
  uuid: string;
  qrCode?: string;
}