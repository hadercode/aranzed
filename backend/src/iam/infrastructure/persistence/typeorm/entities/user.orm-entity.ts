import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleOrmEntity } from './role.orm-entity';
import { PermissionOrmEntity } from './permission.orm-entity';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', nullable: true })
  passwordRecoveryToken: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  jobTitle: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @ManyToMany(() => RoleOrmEntity)
  @JoinTable({ name: 'user_roles' })
  roles: RoleOrmEntity[];

  @ManyToMany(() => PermissionOrmEntity)
  @JoinTable({ name: 'user_permissions' })
  directPermissions: PermissionOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
