import { Injectable, Inject } from '@nestjs/common';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import { STORAGE_SERVICE_TOKEN } from '../../../domain/services/storage.service.interface';
import type { IStorageService } from '../../../domain/services/storage.service.interface';
import { DeleteFileCommand } from './delete-file.command';

@Injectable()
export class DeleteFileUseCase {
  constructor(
    @Inject(STORAGE_SERVICE_TOKEN)
    private readonly storageService: IStorageService,
  ) {}

  async execute(command: DeleteFileCommand): Promise<{ message: string; key: string }> {
    if (!command.key || !command.key.trim()) {
      throw new BusinessRuleException('La clave (key) del archivo a eliminar es obligatoria');
    }

    await this.storageService.deleteFile(command.key);
    return {
      message: 'Archivo eliminado con éxito del bucket',
      key: command.key,
    };
  }
}
