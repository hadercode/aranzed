import { StoredFile } from '../../../domain/entities/stored-file.entity';
import { UploadFileResponseDto } from '../dto/responses/upload-file-response.dto';
import { FileUrlResult } from '../../../application/queries/get-file-url/get-file-url.use-case';
import { FileUrlResponseDto } from '../dto/responses/file-url-response.dto';

export class StorageResponseMapper {
  static toUploadDto(file: StoredFile): UploadFileResponseDto {
    const dto = new UploadFileResponseDto();
    dto.id = file.id;
    dto.key = file.key;
    dto.bucket = file.bucket;
    dto.folder = file.folder;
    dto.originalName = file.originalName;
    dto.fileName = file.fileName;
    dto.mimeType = file.mimeType;
    dto.size = file.size;
    dto.url = file.url || '';
    dto.createdAt = file.createdAt ? file.createdAt.toISOString() : new Date().toISOString();
    return dto;
  }

  static toUrlDto(result: FileUrlResult): FileUrlResponseDto {
    const dto = new FileUrlResponseDto();
    dto.key = result.key;
    dto.url = result.url;
    dto.expiresIn = result.expiresIn;
    return dto;
  }
}
