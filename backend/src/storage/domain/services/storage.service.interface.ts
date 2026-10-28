import { StoredFile } from '../entities/stored-file.entity';

export const STORAGE_SERVICE_TOKEN = 'IStorageService';

export interface UploadFileParams {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
  folder?: string;
  customFileName?: string;
}

export interface IStorageService {
  uploadFile(params: UploadFileParams): Promise<StoredFile>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  deleteFile(key: string): Promise<void>;
  fileExists(key: string): Promise<boolean>;
}
