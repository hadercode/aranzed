import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@/iam/infrastructure/security/guards/permissions.guard';
import { CurrentUser } from '@/iam/infrastructure/security/decorators/current-user.decorator';

import { CreateSalePaymentUseCase } from '@/sales/application/commands/create-sale-payment/create-sale-payment.use-case';
import { CreateSalePaymentCommand } from '@/sales/application/commands/create-sale-payment/create-sale-payment.command';
import { CloseSaleManuallyUseCase } from '@/sales/application/commands/close-sale-manually/close-sale-manually.use-case';
import { CloseSaleManuallyCommand } from '@/sales/application/commands/close-sale-manually/close-sale-manually.command';
import { CancelSalePaymentUseCase } from '@/sales/application/commands/cancel-sale-payment/cancel-sale-payment.use-case';
import { CancelSalePaymentCommand } from '@/sales/application/commands/cancel-sale-payment/cancel-sale-payment.command';

import { FindSalePaymentsUseCase } from '@/sales/application/queries/find-sale-payments/find-sale-payments.use-case';
import { FindSalePaymentByIdUseCase } from '@/sales/application/queries/find-sale-payment-by-id/find-sale-payment-by-id.use-case';
import { FindPendingSalesByCustomerUseCase } from '@/sales/application/queries/find-pending-sales-by-customer/find-pending-sales-by-customer.use-case';
import { FindPaymentsBySaleIdUseCase } from '@/sales/application/queries/find-payments-by-sale-id/find-payments-by-sale-id.use-case';

import {
  CreateSalePaymentDto,
  CloseSaleManuallyDto,
  CancelSalePaymentDto,
  FindSalePaymentsQueryDto,
  SalePaymentResponseDto,
  SaleResponseDto,
} from '../dto';
import { SalePaymentResponseMapper, SaleResponseMapper } from '../mappers';

const UPLOADS_DIR = join(process.cwd(), 'uploads', 'payments');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

@ApiTags('Sales - Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('sales/payments')
export class SalesPaymentsController {
  constructor(
    private readonly createSalePaymentUseCase: CreateSalePaymentUseCase,
    private readonly closeSaleManuallyUseCase: CloseSaleManuallyUseCase,
    private readonly cancelSalePaymentUseCase: CancelSalePaymentUseCase,
    private readonly findSalePaymentsUseCase: FindSalePaymentsUseCase,
    private readonly findSalePaymentByIdUseCase: FindSalePaymentByIdUseCase,
    private readonly findPendingSalesByCustomerUseCase: FindPendingSalesByCustomerUseCase,
    private readonly findPaymentsBySaleIdUseCase: FindPaymentsBySaleIdUseCase,
  ) {}

  @Get()
  @RequirePermissions('sales:read')
  @ApiOperation({
    summary: 'Listar cobros y pagos con filtros y paginación',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de cobros obtenido exitosamente',
  })
  async findAll(@Query() query: FindSalePaymentsQueryDto) {
    const result = await this.findSalePaymentsUseCase.execute(query);
    return {
      payments: SalePaymentResponseMapper.toDtoList(result.payments),
      total: result.total,
    };
  }

  @Get('pending-sales')
  @RequirePermissions('sales:read')
  @ApiOperation({
    summary: 'Obtener ventas pendientes de cobro para cruzar por cliente',
  })
  @ApiResponse({
    status: 200,
    description: 'Ventas pendientes obtenidas con éxito',
  })
  async findPendingSales(@Query('customerName') customerName?: string) {
    return this.findPendingSalesByCustomerUseCase.execute(customerName);
  }

  @Get('by-sale/:saleId')
  @RequirePermissions('sales:read')
  @ApiOperation({
    summary: 'Obtener historial de cobros aplicados a una venta específica',
  })
  @ApiResponse({
    status: 200,
    description: 'Cobros de la venta obtenidos exitosamente',
  })
  async findBySaleId(@Param('saleId', ParseUUIDPipe) saleId: string) {
    const payments = await this.findPaymentsBySaleIdUseCase.execute(saleId);
    return SalePaymentResponseMapper.toDtoList(payments);
  }

  @Get(':id')
  @RequirePermissions('sales:read')
  @ApiOperation({
    summary: 'Obtener detalle completo de un cobro por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Cobro obtenido exitosamente',
    type: SalePaymentResponseDto,
  })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SalePaymentResponseDto> {
    const payment = await this.findSalePaymentByIdUseCase.execute(id);
    return SalePaymentResponseMapper.toDto(payment);
  }

  @Post()
  @RequirePermissions('sales:manage')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Registrar cobro y cruzar con ventas pendientes (actualiza estados y saldos)',
  })
  @ApiResponse({
    status: 201,
    description: 'Cobro registrado exitosamente',
    type: SalePaymentResponseDto,
  })
  async create(
    @Body() dto: CreateSalePaymentDto,
    @CurrentUser('id') userId?: string,
  ): Promise<SalePaymentResponseDto> {
    const command = CreateSalePaymentCommand.fromDto(dto, userId);
    const payment = await this.createSalePaymentUseCase.execute(command);
    return SalePaymentResponseMapper.toDto(payment);
  }

  @Post('upload-receipt')
  @RequirePermissions('sales:manage')
  @ApiOperation({
    summary: 'Subir imagen de comprobante de pago bancario / transferencia',
  })
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
          const uniqueName = `payment-receipt-${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|pdf)$/)) {
          return cb(
            new BadRequestException(
              'Solo se permiten imágenes (jpg, jpeg, png, webp) o documentos PDF',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  uploadReceipt(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'No se proporcionó ningún archivo de comprobante',
      );
    }

    const relativeUrl = `/uploads/payments/${file.filename}`;
    return {
      message: 'Comprobante subido exitosamente',
      url: relativeUrl,
      filename: file.filename,
    };
  }

  @Patch('close-sale/:saleId')
  @RequirePermissions('sales:manage')
  @ApiOperation({
    summary:
      'Cerrar manualmente una venta que tiene saldo mínimo o diferencia de centavos',
  })
  @ApiResponse({
    status: 200,
    description: 'Venta cerrada y marcada como PAGADO exitosamente',
    type: SaleResponseDto,
  })
  async closeSaleManually(
    @Param('saleId', ParseUUIDPipe) saleId: string,
    @Body() dto: CloseSaleManuallyDto,
    @CurrentUser('id') userId?: string,
  ): Promise<SaleResponseDto> {
    const command = CloseSaleManuallyCommand.fromDto(saleId, dto, userId);
    const sale = await this.closeSaleManuallyUseCase.execute(command);
    return SaleResponseMapper.toDto(sale);
  }

  @Patch(':id/cancel')
  @RequirePermissions('sales:manage')
  @ApiOperation({
    summary: 'Anular un cobro y restaurar los saldos en las ventas afectadas',
  })
  @ApiResponse({
    status: 200,
    description: 'Cobro anulado exitosamente',
    type: SalePaymentResponseDto,
  })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelSalePaymentDto,
    @CurrentUser('id') userId?: string,
  ): Promise<SalePaymentResponseDto> {
    const command = new CancelSalePaymentCommand(id, dto.reason, userId);
    const payment = await this.cancelSalePaymentUseCase.execute(command);
    return SalePaymentResponseMapper.toDto(payment);
  }
}
