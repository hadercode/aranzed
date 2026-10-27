import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@/iam/infrastructure/security/guards/permissions.guard';
import { CurrentUser } from '@/iam/infrastructure/security/decorators/current-user.decorator';

import { CreateProductCommand } from '@/catalog/products/application/commands/create-product/create-product.command';
import { UpdateProductCommand } from '@/catalog/products/application/commands/update-product/update-product.command';
import { DeleteProductCommand } from '@/catalog/products/application/commands/delete-product/delete-product.command';
import { GetProductsQuery } from '@/catalog/products/application/queries/get-products/get-products.query';
import { GetProductQuery } from '@/catalog/products/application/queries/get-product/get-product.query';

import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductFiltersDto } from '../dto/product-filters.dto';
import { Product } from '@/catalog/products/domain/entities/product.entity';

@ApiTags('catalog/products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('catalog/products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @RequirePermissions('products:read')
  @ApiOperation({ summary: 'Listar todos los productos del catálogo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos recuperada con éxito',
  })
  async getProducts(@Query() filters: ProductFiltersDto): Promise<Product[]> {
    return this.queryBus.execute<GetProductsQuery, Product[]>(
      new GetProductsQuery(filters),
    );
  }

  @Get(':id')
  @RequirePermissions('products:read')
  @ApiOperation({ summary: 'Obtener detalle de un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Product> {
    return this.queryBus.execute<GetProductQuery, Product>(
      new GetProductQuery(id),
    );
  }

  @Post()
  @RequirePermissions('products:manage')
  @ApiOperation({ summary: 'Crear un nuevo producto en el catálogo' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o producto duplicado',
  })
  async createProduct(
    @Body() dto: CreateProductDto,
    @CurrentUser('id') userId?: string,
  ): Promise<Product> {
    return this.commandBus.execute<CreateProductCommand, Product>(
      new CreateProductCommand(
        dto.name,
        dto.type,
        dto.uomId,
        dto.description,
        dto.imageUrl,
        dto.categoryId,
        dto.profitMargin,
        dto.lastCost,
        dto.lastSalePrice,
        dto.isActive,
        dto.manageInventory,
        userId,
      ),
    );
  }

  @Put(':id')
  @RequirePermissions('products:manage')
  @ApiOperation({ summary: 'Actualizar un producto existente' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado con éxito',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async updateProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.commandBus.execute<UpdateProductCommand, Product>(
      new UpdateProductCommand(id, {
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        type: dto.type,
        uomId: dto.uomId,
        categoryId: dto.categoryId,
        profitMargin: dto.profitMargin,
        lastCost: dto.lastCost,
        lastSalePrice: dto.lastSalePrice,
        isActive: dto.isActive,
        manageInventory: dto.manageInventory,
      }),
    );
  }

  @Delete(':id')
  @RequirePermissions('products:manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({
    status: 204,
    description: 'Producto eliminado con éxito',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async deleteProduct(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.commandBus.execute(new DeleteProductCommand(id));
  }
}
