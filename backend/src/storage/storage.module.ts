import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { STORAGE_SERVICE_TOKEN } from './domain/services/storage.service.interface';
import { S3StorageService } from './infrastructure/s3/s3-storage.service';
import { UploadFileUseCase } from './application/commands/upload-file/upload-file.use-case';
import { DeleteFileUseCase } from './application/commands/delete-file/delete-file.use-case';
import { GetFileUrlUseCase } from './application/queries/get-file-url/get-file-url.use-case';
import { StorageController } from './presentation/http/controllers/storage.controller';

const UseCases = [UploadFileUseCase, DeleteFileUseCase, GetFileUrlUseCase];

@Module({
  imports: [ConfigModule, CqrsModule],
  controllers: [StorageController],
  providers: [
    ...UseCases,
    S3StorageService,
    {
      provide: STORAGE_SERVICE_TOKEN,
      useClass: S3StorageService,
    },
  ],
  exports: [
    STORAGE_SERVICE_TOKEN,
    ...UseCases,
  ],
})
export class StorageModule {}
