import { Role } from '../entities/role.entity';

export interface IRoleRepository {
  save(role: Role): Promise<void>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findByNames(names: string[]): Promise<Role[]>;
  findAll(): Promise<Role[]>;
  delete(id: string): Promise<void>;
}
