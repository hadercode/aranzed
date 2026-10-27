import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({
    example: 'J-12345678-9',
    description:
      'Número de identificación fiscal o registro legal (RUT/RUC/NIT/CIF)',
  })
  @IsOptional()
  @IsString()
  identificationNumber?: string;

  @ApiPropertyOptional({
    example: 'Acme Corporation S.A.S.',
    description: 'Razón social legal',
  })
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional({
    example: 'Acme Store',
    description: 'Nombre comercial o de fantasía',
  })
  @IsOptional()
  @IsString()
  tradeName?: string;

  @ApiPropertyOptional({
    example: 'Soluciones tecnológicas a tu medida',
    description: 'Lema o descripción',
  })
  @IsOptional()
  @IsString()
  slogan?: string;

  // Contact
  @ApiPropertyOptional({ example: '+1 800 555 0199' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '+1 800 555 0198' })
  @IsOptional()
  @IsString()
  secondaryPhone?: string;

  @ApiPropertyOptional({ example: 'contacto@acme.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'https://acme.com' })
  @IsOptional()
  @IsString()
  website?: string;

  // Address
  @ApiPropertyOptional({ example: 'Av. Principal 123' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Edificio Centro, Piso 4' })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional({ example: 'Bogotá' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Cundinamarca' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '110111' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ example: 'Colombia' })
  @IsOptional()
  @IsString()
  country?: string;

  // Currency & Region
  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @ApiPropertyOptional({ example: '$' })
  @IsOptional()
  @IsString()
  currencySymbol?: string;

  @ApiPropertyOptional({ example: 'left', enum: ['left', 'right'] })
  @IsOptional()
  @IsString()
  currencyPosition?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4)
  decimalPlaces?: number;

  @ApiPropertyOptional({ example: 'America/Bogota' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  dateFormat?: string;

  // Email Config
  @ApiPropertyOptional({ example: 'smtp.gmail.com' })
  @IsOptional()
  @IsString()
  smtpHost?: string;

  @ApiPropertyOptional({ example: 587 })
  @IsOptional()
  @IsInt()
  smtpPort?: number;

  @ApiPropertyOptional({ example: 'notificaciones@acme.com' })
  @IsOptional()
  @IsString()
  smtpUser?: string;

  @ApiPropertyOptional({ example: 'app-password-secret' })
  @IsOptional()
  @IsString()
  smtpPassword?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  smtpSecure?: boolean;

  @ApiPropertyOptional({ example: 'Acme Notificaciones' })
  @IsOptional()
  @IsString()
  smtpFromName?: string;

  @ApiPropertyOptional({ example: 'no-reply@acme.com' })
  @IsOptional()
  @IsEmail()
  smtpFromEmail?: string;

  // Branding
  @ApiPropertyOptional({ example: '/uploads/company/logo-123.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: '/uploads/company/logo-dark-123.png' })
  @IsOptional()
  @IsString()
  logoDarkUrl?: string;

  @ApiPropertyOptional({ example: '/favicon.ico' })
  @IsOptional()
  @IsString()
  faviconUrl?: string;

  // Legal / Invoicing
  @ApiPropertyOptional({ example: 'Responsable de IVA' })
  @IsOptional()
  @IsString()
  taxRegime?: string;

  @ApiPropertyOptional({
    example: 'Factura generada por computador según resolución 1234.',
  })
  @IsOptional()
  @IsString()
  footerNotes?: string;
}
