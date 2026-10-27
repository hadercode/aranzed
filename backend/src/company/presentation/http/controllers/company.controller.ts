import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@/iam/infrastructure/security/guards/permissions.guard';
import { GetCompanyQuery } from '../../../application/queries/get-company/get-company.query';
import { UpdateCompanyCommand } from '../../../application/commands/update-company/update-company.command';
import { UpdateCompanyDto } from '../dto/update-company.dto';

const UPLOADS_DIR = join(process.cwd(), 'uploads', 'company');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

@ApiTags('company')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('company')
export class CompanyController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  private sanitizeCompany(company: any) {
    if (!company) return company;
    return {
      ...company,
      smtpPassword: company.smtpPassword ? '********' : '',
    };
  }

  @Get()
  async getCompany() {
    const company = await this.queryBus.execute(new GetCompanyQuery());
    return this.sanitizeCompany(company);
  }

  @Put()
  @RequirePermissions('company:manage')
  async updateCompany(@Body() dto: UpdateCompanyDto) {
    const updated = await this.commandBus.execute(new UpdateCompanyCommand(dto));
    return this.sanitizeCompany(updated);
  }

  @Post('logo')
  @RequirePermissions('company:manage')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
          }
          cb(null, UPLOADS_DIR);
        },
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          const uniqueName = `company-logo-${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException(
              'Solo se permiten imágenes (jpg, jpeg, png, gif, webp)',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'No se proporcionó ningún archivo de imagen',
      );
    }

    const relativeUrl = `/uploads/company/${file.filename}`;
    const updated = await this.commandBus.execute(
      new UpdateCompanyCommand({ logoUrl: relativeUrl }),
    );

    return {
      message: 'Logo actualizado con éxito',
      logoUrl: relativeUrl,
      company: this.sanitizeCompany(updated),
    };
  }
}
