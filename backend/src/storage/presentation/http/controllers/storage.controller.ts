import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@/iam/infrastructure/security/guards/permissions.guard';
import { CurrentUser } from '@/iam/infrastructure/security/decorators/current-user.decorator';

import { UploadFileUseCase } from '../../../application/commands/upload-file/upload-file.use-case';
import { UploadFileCommand } from '../../../application/commands/upload-file/upload-file.command';
import { DeleteFileUseCase } from '../../../application/commands/delete-file/delete-file.use-case';
import { DeleteFileCommand } from '../../../application/commands/delete-file/delete-file.command';
import { GetFileUrlUseCase } from '../../../application/queries/get-file-url/get-file-url.use-case';
import { GetFileUrlQuery } from '../../../application/queries/get-file-url/get-file-url.query';

import {
  UploadFileDto,
  GetFileUrlQueryDto,
  UploadFileResponseDto,
  FileUrlResponseDto,
} from '../dto';
import { StorageResponseMapper } from '../mappers/storage-response.mapper';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly getFileUrlUseCase: GetFileUrlUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
  ) {}

  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Subir archivo al bucket S3 organizado por carpeta/tipo',
    description:
      'Recibe un archivo binario mediante multipart/form-data y un parámetro de carpeta (folder o type). El archivo no se almacena en el disco local del servidor, sino directamente en el bucket de Neon S3, retornando la clave y una URL firmada de acceso seguro.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo binario a subir (imágenes, documentos, etc.)',
        },
        folder: {
          type: 'string',
          description:
            'Carpeta de destino dentro del bucket (ej: products, company, avatars, documents)',
          example: 'products',
        },
        type: {
          type: 'string',
          description: 'Alias alternativo para indicar la carpeta/categoría de destino',
          example: 'products',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo subido con éxito al bucket S3',
    type: UploadFileResponseDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 25 * 1024 * 1024, // 25 MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
    @CurrentUser('id') userId?: string,
  ): Promise<UploadFileResponseDto> {
    if (!file) {
      throw new BadRequestException('Debe proporcionar un archivo en el campo "file"');
    }

    const folder = dto.folder || dto.type || 'general';
    const command = UploadFileCommand.from(file, folder, userId);
    const storedFile = await this.uploadFileUseCase.execute(command);
    return StorageResponseMapper.toUploadDto(storedFile);
  }

  @Get('url')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener URL firmada temporal de acceso seguro para un archivo',
    description:
      'Genera una URL firmada de corta duración mediante AWS S3 Presigner (@aws-sdk/s3-request-presigner) para consultar o renderizar un archivo privado de forma segura sin exponer credenciales.',
  })
  @ApiResponse({
    status: 200,
    description: 'URL firmada generada exitosamente',
    type: FileUrlResponseDto,
  })
  async getFileUrl(
    @Query() query: GetFileUrlQueryDto,
  ): Promise<FileUrlResponseDto> {
    const result = await this.getFileUrlUseCase.execute(
      new GetFileUrlQuery(query.key, query.expiresIn),
    );
    return StorageResponseMapper.toUrlDto(result);
  }

  @Get('view')
  @ApiOperation({
    summary: 'Visualizar o redirigir directamente al archivo seguro en el bucket',
    description:
      'Redirige al cliente (HTTP 302) hacia la URL firmada generada en tiempo real. Endpoint público ideal para utilizarse como src en etiquetas <img> o enlaces directos de descarga sin requerir encabezados Bearer.',
  })
  async viewFile(
    @Query('key') key: string,
    @Res() res: Response,
    @Query('expiresIn') expiresIn?: number,
  ) {
    if (!key || !key.trim()) {
      throw new BadRequestException('El parámetro "key" es requerido');
    }

    const result = await this.getFileUrlUseCase.execute(
      new GetFileUrlQuery(key, expiresIn),
    );
    return res.redirect(HttpStatus.FOUND, result.url);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('storage:manage')
  @ApiOperation({
    summary: 'Eliminar un archivo del bucket S3',
    description: 'Elimina de forma permanente un objeto del bucket mediante su clave (Key).',
  })
  @ApiQuery({
    name: 'key',
    required: true,
    description: 'Clave única del archivo a eliminar en el bucket S3',
    example: 'products/17299000-abcd-zapato.png',
  })
  async deleteFile(
    @Query('key') key: string,
    @CurrentUser('id') userId?: string,
  ) {
    return this.deleteFileUseCase.execute(new DeleteFileCommand(key, userId));
  }
}
