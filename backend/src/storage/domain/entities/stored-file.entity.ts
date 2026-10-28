import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';

export interface StoredFileProps {
  id?: string;
  key: string;
  bucket: string;
  folder: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class StoredFile extends BaseEntity {
  key: string;
  bucket: string;
  folder: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url?: string;

  constructor(props: StoredFileProps) {
    super();
    if (props.id) this.id = props.id;
    this.key = props.key;
    this.bucket = props.bucket;
    this.folder = props.folder;
    this.originalName = props.originalName;
    this.fileName = props.fileName;
    this.mimeType = props.mimeType;
    this.size = props.size;
    this.url = props.url;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  validate(): void {
    if (!this.key || !this.key.trim()) {
      throw new BusinessRuleException('La clave (key) del archivo en el bucket es obligatoria');
    }
    if (!this.bucket || !this.bucket.trim()) {
      throw new BusinessRuleException('El nombre del bucket es obligatorio');
    }
    if (this.size < 0) {
      throw new BusinessRuleException('El tamaño del archivo no puede ser negativo');
    }
  }
}
