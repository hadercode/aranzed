# Backend Clean Architecture & CQRS Boilerplate (NestJS + TypeORM + DDD)

Complete reference template for creating a backend module in `backend/src/<module>/` following the standardized Hexagonal / CQRS / 3-Tier Mapper patterns established in MiniStore.

---

## 1. Domain Layer (`domain/`)

### 1.1 Rich Domain Entity (`domain/entities/<entity>.entity.ts`)
```typescript
import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import { PurchaseItem } from './purchase-item.entity';

export class Purchase extends BaseEntity {
  purchaseNumber: string;
  supplierName: string;
  purchaseDate: Date;
  description?: string | null;
  status: PurchaseStatus;
  invoiceNumber: string;

  // Bimoneda y Tasa de Cambio
  exchangeRate: number;
  functionalCurrency: string;
  localCurrency: string;
  documentCurrency: string;

  // Totales Financieros
  subtotal: number;
  taxAmount: number;
  total: number;
  subtotalLocal: number;
  taxAmountLocal: number;
  totalLocal: number;

  warehouseId?: string | null;
  createdById?: string | null;
  deletedAt?: Date | null;
  items: PurchaseItem[];

  constructor(partial: Partial<Purchase>) {
    super();
    Object.assign(this, partial);
    this.status = partial.status || PurchaseStatus.DRAFT;
    this.purchaseDate = partial.purchaseDate ? new Date(partial.purchaseDate) : new Date();
    this.exchangeRate = partial.exchangeRate && partial.exchangeRate > 0 ? Number(partial.exchangeRate) : 1.0;
    this.functionalCurrency = partial.functionalCurrency || 'USD';
    this.localCurrency = partial.localCurrency || 'VES';
    this.documentCurrency = partial.documentCurrency || 'USD';

    this.items = partial.items
      ? partial.items.map((i) => (i instanceof PurchaseItem ? i : new PurchaseItem(i, this.exchangeRate)))
      : [];

    this.calculateTotals();
  }

  calculateTotals(): void {
    const rate = this.exchangeRate > 0 ? this.exchangeRate : 1.0;
    let sub = 0;
    let tax = 0;
    let subLocal = 0;
    let taxLocal = 0;

    for (const item of this.items) {
      item.calculateFinancials(rate);
      sub += item.subtotal;
      tax += item.taxAmount;
      subLocal += item.subtotalLocal;
      taxLocal += item.taxAmountLocal;
    }

    this.subtotal = Number(sub.toFixed(4));
    this.taxAmount = Number(tax.toFixed(4));
    this.total = Number((this.subtotal + this.taxAmount).toFixed(4));

    this.subtotalLocal = Number(subLocal.toFixed(4));
    this.taxAmountLocal = Number(taxLocal.toFixed(4));
    this.totalLocal = Number((this.subtotalLocal + this.taxAmountLocal).toFixed(4));
  }

  validate(): void {
    if (!this.supplierName?.trim()) {
      throw new BusinessRuleException('El nombre del proveedor es obligatorio');
    }
    if (!this.invoiceNumber?.trim()) {
      throw new BusinessRuleException('El número de factura es obligatorio');
    }
    if (this.exchangeRate <= 0) {
      throw new BusinessRuleException('La tasa de cambio debe ser mayor a cero');
    }
    if (!this.items || this.items.length === 0) {
      throw new BusinessRuleException('Debe incluir al menos un ítem en el detalle');
    }
    for (const item of this.items) {
      item.validate();
    }
  }

  transitionTo(newStatus: PurchaseStatus): void {
    if (this.status === newStatus) return;
    if (this.status === PurchaseStatus.CANCELLED) {
      throw new BusinessRuleException('No se puede cambiar el estado de un registro cancelado');
    }
    if (this.status === PurchaseStatus.COMPLETED && newStatus === PurchaseStatus.DRAFT) {
      throw new BusinessRuleException('Un registro completado no puede revertirse a borrador');
    }
    this.status = newStatus;
  }

  ensureCanBeUpdated(): void {
    if (this.status === PurchaseStatus.COMPLETED) {
      throw new BusinessRuleException('No se puede modificar un registro en estado COMPLETADO');
    }
  }

  ensureCanBeDeleted(): void {
    if (this.status === PurchaseStatus.COMPLETED) {
      throw new BusinessRuleException('No se puede eliminar un registro en estado COMPLETADO');
    }
  }
}
```

---

### 1.2 Segregated Repository Interface (`domain/repositories/<entity>.repository.interface.ts`)
```typescript
import { Purchase } from '../entities/purchase.entity';
import { PurchaseStatus } from '../enums/purchase-status.enum';

export const PURCHASE_REPOSITORY_TOKEN = 'IPurchaseRepository';
export const PURCHASE_READ_REPOSITORY_TOKEN = 'IPurchaseReadRepository';
export const PURCHASE_WRITE_REPOSITORY_TOKEN = 'IPurchaseWriteRepository';

export interface FindPurchasesFilters {
  search?: string;
  status?: PurchaseStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

/** Contrato exclusivo de LECTURA para casos de uso de tipo Query */
export interface IPurchaseReadRepository {
  findAll(filters?: FindPurchasesFilters): Promise<{ purchases: Purchase[]; total: number }>;
  findById(id: string): Promise<Purchase | null>;
  findByNumber(purchaseNumber: string): Promise<Purchase | null>;
  findByInvoiceNumber(invoiceNumber: string): Promise<Purchase | null>;
}

/** Contrato exclusivo de ESCRITURA para casos de uso de tipo Command */
export interface IPurchaseWriteRepository {
  save(purchase: Purchase): Promise<Purchase>;
  delete(id: string): Promise<void>;
  getNextSequenceNumber(): Promise<string>;
}

/** Contrato unificado que implementa ambos puertos */
export interface IPurchaseRepository extends IPurchaseReadRepository, IPurchaseWriteRepository {}
```

---

## 2. Infrastructure Layer (`infrastructure/`)

### 2.1 Persistence Mapper (`infrastructure/persistence/typeorm/mappers/<entity>.orm-mapper.ts`)
```typescript
import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import { PurchaseOrmEntity } from '../entities/purchase.orm-entity';
import { PurchaseItemOrmMapper } from './purchase-item.orm-mapper';

export class PurchaseOrmMapper {
  static toDomain(orm: PurchaseOrmEntity): Purchase {
    const purchase = new Purchase({
      id: orm.id,
      purchaseNumber: orm.purchaseNumber,
      supplierName: orm.supplierName,
      purchaseDate: orm.purchaseDate ? new Date(orm.purchaseDate) : new Date(),
      description: orm.description,
      status: orm.status,
      invoiceNumber: orm.invoiceNumber,
      warehouseId: orm.warehouseId || null,
      createdById: orm.createdById || null,
      exchangeRate: Number(orm.exchangeRate) || 1.0,
      functionalCurrency: orm.functionalCurrency || 'USD',
      localCurrency: orm.localCurrency || 'VES',
      documentCurrency: orm.documentCurrency || 'USD',
      subtotal: Number(orm.subtotal) || 0,
      taxAmount: Number(orm.taxAmount) || 0,
      total: Number(orm.total) || 0,
      subtotalLocal: Number(orm.subtotalLocal) || 0,
      taxAmountLocal: Number(orm.taxAmountLocal) || 0,
      totalLocal: Number(orm.totalLocal) || 0,
      items: PurchaseItemOrmMapper.toDomainList(orm.items || [], Number(orm.exchangeRate) || 1.0),
    });

    purchase.createdAt = orm.createdAt;
    purchase.updatedAt = orm.updatedAt;
    purchase.deletedAt = orm.deletedAt || null;
    return purchase;
  }

  static toDomainList(orms: PurchaseOrmEntity[]): Purchase[] {
    return (orms || []).map((orm) => this.toDomain(orm));
  }

  static toOrm(domain: Purchase): PurchaseOrmEntity {
    const orm = new PurchaseOrmEntity();
    Object.assign(orm, {
      id: domain.id,
      purchaseNumber: domain.purchaseNumber,
      supplierName: domain.supplierName,
      purchaseDate: domain.purchaseDate ? new Date(domain.purchaseDate) : new Date(),
      description: domain.description ?? null,
      status: domain.status,
      invoiceNumber: domain.invoiceNumber,
      warehouseId: domain.warehouseId || null,
      createdById: domain.createdById || null,
      exchangeRate: domain.exchangeRate,
      functionalCurrency: domain.functionalCurrency,
      localCurrency: domain.localCurrency,
      documentCurrency: domain.documentCurrency,
      subtotal: domain.subtotal,
      taxAmount: domain.taxAmount,
      total: domain.total,
      subtotalLocal: domain.subtotalLocal,
      taxAmountLocal: domain.taxAmountLocal,
      totalLocal: domain.totalLocal,
      items: domain.items?.length
        ? PurchaseItemOrmMapper.toOrmList(domain.items, domain.id)
        : [],
    });
    return orm;
  }
}
```

---

### 2.2 Transactional Repository Adapter (`infrastructure/persistence/typeorm/repositories/typeorm-<entity>.repository.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import {
  IPurchaseRepository,
  IPurchaseReadRepository,
  IPurchaseWriteRepository,
  FindPurchasesFilters,
} from '@/purchases/domain/repositories/purchase.repository.interface';
import { PurchaseOrmEntity } from '../entities/purchase.orm-entity';
import { PurchaseItemOrmEntity } from '../entities/purchase-item.orm-entity';
import { PurchaseOrmMapper, PurchaseItemOrmMapper } from '../mappers';

@Injectable()
export class TypeOrmPurchaseRepository
  implements IPurchaseRepository, IPurchaseReadRepository, IPurchaseWriteRepository
{
  constructor(
    @InjectRepository(PurchaseOrmEntity)
    private readonly purchaseRepo: Repository<PurchaseOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(filters?: FindPurchasesFilters): Promise<{ purchases: Purchase[]; total: number }> {
    const qb = this.purchaseRepo
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.items', 'item')
      .orderBy('purchase.purchaseDate', 'DESC');

    if (filters?.search) {
      const term = `%${filters.search.toLowerCase()}%`;
      qb.andWhere('(LOWER(purchase.supplierName) LIKE :term OR LOWER(purchase.invoiceNumber) LIKE :term)', { term });
    }

    if (filters?.limit) qb.take(filters.limit);
    if (filters?.offset) qb.skip(filters.offset);

    const [orms, total] = await qb.getManyAndCount();
    return { purchases: PurchaseOrmMapper.toDomainList(orms), total };
  }

  async findById(id: string): Promise<Purchase | null> {
    const orm = await this.purchaseRepo.findOne({
      where: { id },
      relations: { items: true },
    });
    return orm ? PurchaseOrmMapper.toDomain(orm) : null;
  }

  async save(purchase: Purchase): Promise<Purchase> {
    await this.dataSource.transaction(async (manager) => {
      const orm = PurchaseOrmMapper.toOrm(purchase);
      await manager.save(PurchaseOrmEntity, orm);

      await manager.delete(PurchaseItemOrmEntity, { purchaseId: purchase.id });
      if (purchase.items && purchase.items.length > 0) {
        const itemOrms = PurchaseItemOrmMapper.toOrmList(purchase.items, purchase.id);
        await manager.save(PurchaseItemOrmEntity, itemOrms);
      }
    });

    const saved = await this.findById(purchase.id);
    return saved || purchase;
  }

  async delete(id: string): Promise<void> {
    await this.purchaseRepo.softDelete(id);
  }

  async getNextSequenceNumber(): Promise<string> {
    const count = await this.purchaseRepo.count({ withDeleted: true });
    return `COM-${(count + 1).toString().padStart(4, '0')}`;
  }
}
```

---

## 3. Application Layer (`application/`)

### 3.1 Command Payload (`application/commands/create-<entity>/create-<entity>.command.ts`)
```typescript
import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';

export class CreatePurchaseCommand {
  supplierName: string;
  invoiceNumber: string;
  purchaseDate: Date;
  description?: string;
  status?: PurchaseStatus;
  warehouseId?: string;
  exchangeRate?: number;
  items: Array<{ materialId: string; quantity: number; unitCost: number }>;
  createdById?: string;

  constructor(partial: Partial<CreatePurchaseCommand>) {
    Object.assign(this, partial);
    if (partial.purchaseDate) {
      this.purchaseDate = partial.purchaseDate instanceof Date ? partial.purchaseDate : new Date(partial.purchaseDate);
    }
  }

  static fromDto(dto: any, createdById?: string): CreatePurchaseCommand {
    return new CreatePurchaseCommand({ ...dto, createdById });
  }
}
```

### 3.2 Command Use Case (`application/commands/create-<entity>/create-<entity>.use-case.ts`)
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import {
  PURCHASE_REPOSITORY_TOKEN,
  IPurchaseRepository,
} from '@/purchases/domain/repositories/purchase.repository.interface';
import { PurchaseCommandMapper } from '@/purchases/application/mappers';
import { PurchaseItemsService, PurchaseCompletionService } from '@/purchases/application/services';
import { CreatePurchaseCommand } from './create-purchase.command';

@Injectable()
export class CreatePurchaseUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY_TOKEN)
    private readonly repository: IPurchaseRepository,
    private readonly itemsService: PurchaseItemsService,
    private readonly completionService: PurchaseCompletionService,
  ) {}

  async execute(command: CreatePurchaseCommand): Promise<Purchase> {
    this.itemsService.ensureHasItems(command.items);
    await this.itemsService.validateUniqueInvoice(command.invoiceNumber, command.supplierName);

    const purchaseNumber = await this.itemsService.resolvePurchaseNumber();
    const purchaseId = randomUUID();
    const currencies = PurchaseCommandMapper.resolveCurrencies(command);

    const purchaseItems = await this.itemsService.buildPurchaseItems(command.items, {
      purchaseId,
      ...currencies,
    });

    const purchase = PurchaseCommandMapper.toDomain(
      { ...command, id: purchaseId, purchaseNumber, ...currencies },
      purchaseItems,
    );

    purchase.validate();
    const saved = await this.repository.save(purchase);

    if (saved.status === PurchaseStatus.COMPLETED) {
      await this.completionService.completePurchase(saved);
    }

    return saved;
  }
}
```

### 3.3 Query Use Case (`application/queries/find-<entities>/find-<entities>.use-case.ts`)
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import {
  PURCHASE_READ_REPOSITORY_TOKEN,
  IPurchaseReadRepository,
  FindPurchasesFilters,
} from '@/purchases/domain/repositories/purchase.repository.interface';

@Injectable()
export class FindPurchasesUseCase {
  constructor(
    @Inject(PURCHASE_READ_REPOSITORY_TOKEN)
    private readonly repository: IPurchaseReadRepository,
  ) {}

  async execute(filters?: FindPurchasesFilters): Promise<{ purchases: Purchase[]; total: number }> {
    return this.repository.findAll(filters);
  }
}
```

---

## 4. Presentation Layer (`presentation/http/`)

### 4.1 Response Mapper (`presentation/http/mappers/<entity>-response.mapper.ts`)
```typescript
import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import { PurchaseResponseDto } from '../dto/responses/purchase-response.dto';

export class PurchaseResponseMapper {
  static toDto(purchase: Purchase): PurchaseResponseDto {
    const dto = new PurchaseResponseDto();
    dto.id = purchase.id;
    dto.purchaseNumber = purchase.purchaseNumber;
    dto.supplierName = purchase.supplierName;
    dto.invoiceNumber = purchase.invoiceNumber;
    dto.status = purchase.status;
    dto.total = purchase.total;
    dto.totalLocal = purchase.totalLocal;
    dto.purchaseDate = purchase.purchaseDate.toISOString();
    dto.createdAt = purchase.createdAt?.toISOString();
    return dto;
  }

  static toDtoList(purchases: Purchase[]): PurchaseResponseDto[] {
    return (purchases || []).map((p) => this.toDto(p));
  }
}
```

### 4.2 Controller (`presentation/http/controllers/<entity>.controller.ts`)
```typescript
import { Controller, Get, Post, Body, Query, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import { PermissionsGuard, RequirePermissions } from '@/iam/infrastructure/security/guards/permissions.guard';
import { CurrentUser } from '@/iam/infrastructure/security/decorators/current-user.decorator';
import { CreatePurchaseUseCase } from '../../application/commands/create-purchase/create-purchase.use-case';
import { CreatePurchaseCommand } from '../../application/commands/create-purchase/create-purchase.command';
import { FindPurchasesUseCase } from '../../application/queries/find-purchases/find-purchases.use-case';
import { CreatePurchaseDto, FindPurchasesQueryDto, PurchaseResponseDto } from '../dto';
import { PurchaseResponseMapper } from '../mappers';

@ApiTags('Purchases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(
    private readonly createPurchaseUseCase: CreatePurchaseUseCase,
    private readonly findPurchasesUseCase: FindPurchasesUseCase,
  ) {}

  @Get()
  @RequirePermissions('purchases:read')
  @ApiOperation({ summary: 'Listar compras' })
  async getPurchases(@Query() query: FindPurchasesQueryDto) {
    const result = await this.findPurchasesUseCase.execute(query);
    return {
      purchases: PurchaseResponseMapper.toDtoList(result.purchases),
      total: result.total,
    };
  }

  @Post()
  @RequirePermissions('purchases:manage')
  @ApiOperation({ summary: 'Crear compra' })
  async createPurchase(
    @Body() dto: CreatePurchaseDto,
    @CurrentUser('id') userId?: string,
  ): Promise<PurchaseResponseDto> {
    const command = CreatePurchaseCommand.fromDto(dto, userId);
    const entity = await this.createPurchaseUseCase.execute(command);
    return PurchaseResponseMapper.toDto(entity);
  }
}
```

---

## 5. NestJS Module Registration (`<module>.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { PurchaseOrmEntity } from './infrastructure/persistence/typeorm/entities/purchase.orm-entity';
import { PurchaseItemOrmEntity } from './infrastructure/persistence/typeorm/entities/purchase-item.orm-entity';
import { TypeOrmPurchaseRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-purchase.repository';
import {
  PURCHASE_REPOSITORY_TOKEN,
  PURCHASE_READ_REPOSITORY_TOKEN,
  PURCHASE_WRITE_REPOSITORY_TOKEN,
} from './domain/repositories/purchase.repository.interface';
import { PurchasesController } from './presentation/http/controllers/purchases.controller';
import { CreatePurchaseUseCase } from './application/commands/create-purchase/create-purchase.use-case';
import { FindPurchasesUseCase } from './application/queries/find-purchases/find-purchases.use-case';
import { PurchaseCompletionService, PurchaseItemsService } from './application/services';
import { MaterialPurchaseCompletedListener } from './application/events/material-purchase-completed.listener';

const UseCases = [CreatePurchaseUseCase, FindPurchasesUseCase];
const Services = [PurchaseCompletionService, PurchaseItemsService];
const EventListeners = [MaterialPurchaseCompletedListener];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([PurchaseOrmEntity, PurchaseItemOrmEntity]),
  ],
  controllers: [PurchasesController],
  providers: [
    ...UseCases,
    ...Services,
    ...EventListeners,
    {
      provide: PURCHASE_REPOSITORY_TOKEN,
      useClass: TypeOrmPurchaseRepository,
    },
    {
      provide: PURCHASE_READ_REPOSITORY_TOKEN,
      useExisting: PURCHASE_REPOSITORY_TOKEN,
    },
    {
      provide: PURCHASE_WRITE_REPOSITORY_TOKEN,
      useExisting: PURCHASE_REPOSITORY_TOKEN,
    },
  ],
  exports: [
    PURCHASE_REPOSITORY_TOKEN,
    PURCHASE_READ_REPOSITORY_TOKEN,
    PURCHASE_WRITE_REPOSITORY_TOKEN,
    ...UseCases,
    ...Services,
  ],
})
export class PurchasesModule {}
```
