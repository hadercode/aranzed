import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('permissions')
export class PermissionOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  action: string;

  @Column()
  resource: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
