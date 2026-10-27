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
import { PaymentMethod } from '@/sales/domain/enums/payment-method.enum';
import { PaymentStatus } from '@/sales/domain/enums/payment-status.enum';
import { SalePaymentAllocationOrmEntity } from './sale-payment-allocation.orm-entity';

@Entity('sale_payments')
export class SalePaymentOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index('IDX_sale_payments_payment_number', { unique: true })
  @Column({ name: 'payment_number', type: 'varchar', length: 50, unique: true })
  paymentNumber: string;

  @Index('IDX_sale_payments_customer_name')
  @Column({ name: 'customer_name', type: 'varchar', length: 150 })
  customerName: string;

  @Column({
    name: 'customer_tax_id',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  customerTaxId: string | null;

  @Index('IDX_sale_payments_payment_date')
  @Column({
    name: 'payment_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  paymentDate: Date;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    length: 30,
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference: string | null;

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
  amount: number;

  @Column({
    name: 'amount_local',
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
  amountLocal: number;

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

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ name: 'receipt_url', type: 'text', nullable: true })
  receiptUrl: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Index('IDX_sale_payments_status')
  @Column({
    type: 'varchar',
    length: 20,
    enum: PaymentStatus,
    default: PaymentStatus.CONFIRMED,
  })
  status: PaymentStatus;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(
    () => SalePaymentAllocationOrmEntity,
    (allocation) => allocation.payment,
    { cascade: true, eager: false },
  )
  allocations: SalePaymentAllocationOrmEntity[];
}
