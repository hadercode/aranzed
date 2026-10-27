import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionOrmEntity } from './permission.orm-entity';

@Entity('roles')
export class RoleOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => PermissionOrmEntity)
  @JoinTable({ name: 'role_permissions' })
  permissions: PermissionOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
