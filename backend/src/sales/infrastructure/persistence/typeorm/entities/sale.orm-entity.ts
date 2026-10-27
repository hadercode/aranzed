import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { SaleItemOrmEntity } from './sale-item.orm-entity';
import { SaleType } from '@/sales/domain/enums/sale-type.enum';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { PaymentMethod } from '@/sales/domain/enums/payment-method.enum';
import { SalePaymentTerm } from '@/sales/domain/enums/sale-payment-term.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';

@Entity('sales')
export class SaleOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index('IDX_sales_sale_number', { unique: true })
  @Column({ name: 'sale_number', type: 'varchar', length: 50, unique: true })
  saleNumber: string;

  @Index('IDX_sales_sale_type')
  @Column({
    name: 'sale_type',
    type: 'varchar',
    length: 30,
    enum: SaleType,
    default: SaleType.DIRECT_SALE,
  })
  saleType: SaleType;

  @Index('IDX_sales_payment_term')
  @Column({
    name: 'payment_term',
    type: 'varchar',
    length: 20,
    enum: SalePaymentTerm,
    default: SalePaymentTerm.CONTADO,
  })
  paymentTerm: SalePaymentTerm;

  @Column({ name: 'due_date', type: 'timestamp', nullable: true })
  dueDate: Date | null;

  @Index('IDX_sales_paid_status')
  @Column({
    name: 'paid_status',
    type: 'varchar',
    length: 20,
    enum: SalePaidStatus,
    default: SalePaidStatus.PENDIENTE,
  })
  paidStatus: SalePaidStatus;

  @Index('IDX_sales_status')
  @Column({
    type: 'varchar',
    length: 30,
    enum: SaleStatus,
    default: SaleStatus.DRAFT,
  })
  status: SaleStatus;

  @Index('IDX_sales_customer_name')
  @Column({
    name: 'customer_name',
    type: 'varchar',
    length: 150,
    default: 'Consumidor Final',
  })
  customerName: string;

  @Column({
    name: 'customer_tax_id',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  customerTaxId: string | null;

  @Column({
    name: 'customer_email',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  customerEmail: string | null;

  @Column({
    name: 'customer_phone',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  customerPhone: string | null;

  @Column({ name: 'customer_address', type: 'text', nullable: true })
  customerAddress: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    length: 30,
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @Column({ name: 'payment_notes', type: 'text', nullable: true })
  paymentNotes: string | null;

  @Index('IDX_sales_sale_date')
  @Column({
    name: 'sale_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  saleDate: Date;

  @Column({ name: 'valid_until', type: 'timestamp', nullable: true })
  validUntil: Date | null;

  @Column({
    name: 'exchange_rate',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 1.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 1.0,
    },
  })
  exchangeRate: number;

  @Column({
    name: 'functional_currency',
    type: 'varchar',
    length: 10,
    default: 'USD',
  })
  functionalCurrency: string;

  @Column({
    name: 'local_currency',
    type: 'varchar',
    length: 10,
    default: 'VES',
  })
  localCurrency: string;

  @Column({
    name: 'document_currency',
    type: 'varchar',
    length: 10,
    default: 'USD',
  })
  documentCurrency: string;

  // Totales Moneda Funcional (USD)
  @Column({
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  subtotal: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  discountAmount: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  taxAmount: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  total: number;

  // Totales Moneda Local (VES)
  @Column({
    name: 'subtotal_local',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  subtotalLocal: number;

  @Column({
    name: 'discount_amount_local',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  discountAmountLocal: number;

  @Column({
    name: 'tax_amount_local',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  taxAmountLocal: number;

  @Column({
    name: 'total_local',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  totalLocal: number;

  @Column({
    name: 'paid_amount',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  paidAmount: number;

  @Column({
    name: 'paid_amount_local',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  paidAmountLocal: number;

  @Column({ name: 'converted_from_quotation_id', type: 'uuid', nullable: true })
  convertedFromQuotationId: string | null;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => SaleItemOrmEntity, (item) => item.sale, {
    cascade: true,
    eager: true,
  })
  items: SaleItemOrmEntity[];
}
