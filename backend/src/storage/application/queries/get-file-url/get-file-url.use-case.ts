import { Injectable, Inject } from '@nestjs/common';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import { STORAGE_SERVICE_TOKEN } from '../../../domain/services/storage.service.interface';
import type { IStorageService } from '../../../domain/services/storage.service.interface';
import { GetFileUrlQuery } from './get-file-url.query';

export interface FileUrlResult {
  key: string;
  url: string;
  expiresIn: number;
}

@Injectable()
export class GetFileUrlUseCase {
  constructor(
    @Inject(STORAGE_SERVICE_TOKEN)
    private readonly storageService: IStorageService,
  ) {}

  async execute(query: GetFileUrlQuery): Promise<FileUrlResult> {
    if (!query.key || !query.key.trim()) {
      throw new BusinessRuleException('La clave (key) del archivo es requerida');
    }

    const expiresIn = query.expiresIn && query.expiresIn > 0 ? query.expiresIn : 3600;
    const url = await this.storageService.getSignedUrl(query.key, expiresIn);

    return {
      key: query.key,
      url,
      expiresIn,
    };
  }
}
