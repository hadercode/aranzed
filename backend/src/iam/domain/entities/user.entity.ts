import { BaseEntity } from '../../../core/domain/base.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

export class User extends BaseEntity {
  email: string;
  passwordHash: string;
  roles: Role[];
  directPermissions: Permission[];
  passwordRecoveryToken?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  jobTitle?: string;
  bio?: string;

  constructor(
    id: string,
    email: string,
    passwordHash: string,
    roles: Role[] = [],
    directPermissions: Permission[] = [],
    passwordRecoveryToken?: string,
    firstName?: string,
    lastName?: string,
    phone?: string,
    avatarUrl?: string,
    jobTitle?: string,
    bio?: string,
  ) {
    super();
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.roles = roles;
    this.directPermissions = directPermissions;
    this.passwordRecoveryToken = passwordRecoveryToken;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.avatarUrl = avatarUrl;
    this.jobTitle = jobTitle;
    this.bio = bio;
  }

  assignRole(role: Role) {
    if (!this.roles.find((r) => r.id === role.id)) {
      this.roles.push(role);
    }
  }

  assignDirectPermission(permission: Permission) {
    if (!this.directPermissions.find((p) => p.id === permission.id)) {
      this.directPermissions.push(permission);
    }
  }

  revokeDirectPermission(permissionId: string) {
    this.directPermissions = this.directPermissions.filter(
      (p) => p.id !== permissionId,
    );
  }

  getAllPermissions(): string[] {
    const rolePermissions = this.roles.flatMap((r) =>
      r.permissions.map((p) => `${p.resource}:${p.action}`),
    );
    const directPerms = this.directPermissions.map(
      (p) => `${p.resource}:${p.action}`,
    );
    return [...new Set([...rolePermissions, ...directPerms])];
  }
}
