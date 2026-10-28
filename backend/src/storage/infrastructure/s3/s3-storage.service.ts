import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import {
  IStorageService,
  UploadFileParams,
} from '../../domain/services/storage.service.interface';
import { StoredFile } from '../../domain/entities/stored-file.entity';

@Injectable()
export class S3StorageService implements IStorageService {
  private readonly logger = new Logger(S3StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('AWS_ENDPOINT_URL_S3');
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-2';
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    this.bucket =
      this.configService.get<string>('AWS_S3_BUCKET') || 'uploads';

    const clientConfig: S3ClientConfig = {
      region,
      forcePathStyle: true,
    };

    if (endpoint) {
      clientConfig.endpoint = endpoint;
    }

    if (accessKeyId && secretAccessKey) {
      clientConfig.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    this.s3Client = new S3Client(clientConfig);
    this.logger.log(
      `S3StorageService initialized. Bucket: ${this.bucket}, Endpoint: ${endpoint || 'AWS Default'}, Region: ${region}`,
    );
  }

  /**
   * Sube un archivo a la carpeta especificada en el bucket S3 (Neon)
   */
  async uploadFile(params: UploadFileParams): Promise<StoredFile> {
    const { buffer, originalName, mimeType, size, folder, customFileName } = params;

    const sanitizedFolder = this.sanitizeFolder(folder);
    const fileName = customFileName || this.generateFileName(originalName);
    const key = `${sanitizedFolder}/${fileName}`;

    try {
      this.logger.log(`Subiendo archivo a S3: Bucket="${this.bucket}", Key="${key}", Size=${size} bytes`);

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
        }),
      );

      // Generar URL firmada temporal de 1 hora para acceso inmediato
      const signedUrl = await this.getSignedUrl(key, 3600);

      return new StoredFile({
        id: randomUUID(),
        key,
        bucket: this.bucket,
        folder: sanitizedFolder,
        originalName,
        fileName,
        mimeType,
        size,
        url: signedUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      this.logger.error(`Error subiendo archivo a S3 [Key: ${key}]: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        `Error al almacenar el archivo en S3: ${error.message}`,
      );
    }
  }

  /**
   * Obtiene una URL firmada temporal para acceder o mostrar el archivo de forma segura
   */
  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error(`Error generando URL firmada para [Key: ${key}]: ${error.message}`);
      throw new InternalServerErrorException(
        `Error al generar la URL de acceso al archivo: ${error.message}`,
      );
    }
  }

  /**
   * Elimina un archivo del bucket
   */
  async deleteFile(key: string): Promise<void> {
    try {
      this.logger.log(`Eliminando archivo de S3: Bucket="${this.bucket}", Key="${key}"`);
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.error(`Error eliminando archivo de S3 [Key: ${key}]: ${error.message}`);
      throw new InternalServerErrorException(
        `Error al eliminar el archivo de S3: ${error.message}`,
      );
    }
  }

  /**
   * Verifica si un archivo existe en el bucket
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      this.logger.warn(`Error al verificar existencia de archivo [Key: ${key}]: ${error.message}`);
      return false;
    }
  }

  /**
   * Normaliza y sanitiza la ruta de carpetas evitando path traversal
   */
  private sanitizeFolder(folder?: string): string {
    if (!folder || !folder.trim()) return 'general';
    const cleaned = folder
      .trim()
      .replace(/\\+/g, '/')
      .replace(/\.{2,}/g, '') // Previene ..
      .replace(/^\/+|\/+$/g, '') // Quita slashes iniciales y finales
      .replace(/[^a-zA-Z0-9_\-\/]/g, ''); // Permite alfanuméricos, guiones y subdirectorios
    return cleaned || 'general';
  }

  /**
   * Genera un nombre de archivo único preservando la extensión original
   */
  private generateFileName(originalName: string): string {
    const ext = extname(originalName).toLowerCase();
    const baseName = originalName
      .substring(0, originalName.length - ext.length)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50);

    const timestamp = Date.now();
    const shortId = randomUUID().slice(0, 8);
    return `${timestamp}-${shortId}-${baseName || 'file'}${ext}`;
  }
}
