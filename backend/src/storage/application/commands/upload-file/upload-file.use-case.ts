import { Injectable, Inject } from '@nestjs/common';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import type { IStorageService } from '../../../domain/services/storage.service.interface';
import { STORAGE_SERVICE_TOKEN } from '../../../domain/services/storage.service.interface';
import { StoredFile } from '../../../domain/entities/stored-file.entity';
import { UploadFileCommand } from './upload-file.command';

@Injectable()
export class UploadFileUseCase {
  constructor(
    @Inject(STORAGE_SERVICE_TOKEN)
    private readonly storageService: IStorageService,
  ) {}

  async execute(command: UploadFileCommand): Promise<StoredFile> {
    if (!command.file) {
      throw new BusinessRuleException('No se ha proporcionado ningún archivo para subir');
    }

    if (!command.file.buffer || command.file.buffer.length === 0) {
      throw new BusinessRuleException('El archivo subido está vacío');
    }

    return this.storageService.uploadFile({
      buffer: command.file.buffer,
      originalName: command.file.originalname,
      mimeType: command.file.mimetype,
      size: command.file.size,
      folder: command.folder,
    });
  }
}
