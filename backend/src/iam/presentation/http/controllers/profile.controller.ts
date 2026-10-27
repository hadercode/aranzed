import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import { GetProfileQuery } from '@/iam/application/queries/get-profile/get-profile.query';
import { UpdateProfileCommand } from '@/iam/application/commands/update-profile/update-profile.command';
import { ChangePasswordCommand } from '@/iam/application/commands/change-password/change-password.command';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

const AVATARS_DIR = join(process.cwd(), 'uploads', 'avatars');
if (!fs.existsSync(AVATARS_DIR)) {
  fs.mkdirSync(AVATARS_DIR, { recursive: true });
}

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getProfile(@Req() req: any) {
    const userId = req.user.userId;
    return this.queryBus.execute(new GetProfileQuery(userId));
  }

  @Put()
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const userId = req.user.userId;
    const updated = await this.commandBus.execute(
      new UpdateProfileCommand(userId, dto),
    );
    return {
      message: 'Perfil actualizado con éxito',
      user: updated,
    };
  }

  @Put('password')
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    const userId = req.user.userId;
    return this.commandBus.execute(
      new ChangePasswordCommand(userId, dto.currentPassword, dto.newPassword),
    );
  }

  @Post('avatar')
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
          if (!fs.existsSync(AVATARS_DIR)) {
            fs.mkdirSync(AVATARS_DIR, { recursive: true });
          }
          cb(null, AVATARS_DIR);
        },
        filename: (req: any, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          const userId = req.user?.userId || randomUUID().slice(0, 8);
          const uniqueName = `avatar-${userId}-${Date.now()}${ext}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException(
              'Solo se permiten imágenes (JPG, JPEG, PNG, GIF, WEBP)',
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
  async uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const userId = req.user.userId;
    const relativeUrl = `/uploads/avatars/${file.filename}`;

    const updated = await this.commandBus.execute(
      new UpdateProfileCommand(userId, { avatarUrl: relativeUrl }),
    );

    return {
      message: 'Foto de perfil actualizada con éxito',
      avatarUrl: relativeUrl,
      user: updated,
    };
  }

  @Delete('avatar')
  async deleteAvatar(@Req() req: any) {
    const userId = req.user.userId;
    const updated = await this.commandBus.execute(
      new UpdateProfileCommand(userId, { avatarUrl: null }),
    );
    return {
      message: 'Foto de perfil eliminada con éxito',
      avatarUrl: null,
      user: updated,
    };
  }
}
