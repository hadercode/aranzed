import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SaleOrmEntity } from './sale.orm-entity';
import { SalePaymentOrmEntity } from './sale-payment.orm-entity';

@Entity('sale_payment_allocations')
export class SalePaymentAllocationOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index('IDX_allocations_payment_id')
  @Column({ name: 'payment_id', type: 'uuid' })
  paymentId: string;

  @Index('IDX_allocations_sale_id')
  @Column({ name: 'sale_id', type: 'uuid' })
  saleId: string;

  @Column({
    name: 'amount_allocated',
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
  amountAllocated: number;

  @Column({
    name: 'amount_allocated_local',
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
  amountAllocatedLocal: number;

  @Column({
    name: 'difference_adjustment',
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
  differenceAdjustment: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => SalePaymentOrmEntity, (payment) => payment.allocations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'payment_id' })
  payment: SalePaymentOrmEntity;

  @ManyToOne(() => SaleOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'sale_id' })
  sale: SaleOrmEntity;
}
