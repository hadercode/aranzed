import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLogOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  userEmail: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  userName: string | null;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  model: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  entityId: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'jsonb', nullable: true })
  previousState: any | null;

  @Column({ type: 'jsonb', nullable: true })
  newState: any | null;

  @Column({ type: 'jsonb', nullable: true })
  changes: any | null;

  @Column({ type: 'varchar', length: 100, default: '127.0.0.1' })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ type: 'varchar', length: 10 })
  method: string;

  @Column({ type: 'varchar', length: 500 })
  endpoint: string;

  @Column({ type: 'int', default: 200 })
  statusCode: number;

  @Index()
  @Column({ type: 'varchar', length: 20, default: 'SUCCESS' })
  status: 'SUCCESS' | 'FAILED';

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ type: 'int', default: 0 })
  durationMs: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any | null;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
