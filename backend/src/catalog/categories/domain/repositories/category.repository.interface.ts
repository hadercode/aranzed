import { Category } from '../entities/category.entity';

export const CATEGORY_REPOSITORY_TOKEN = 'ICategoryRepository';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findByPathPrefix(pathPrefix: string): Promise<Category[]>;
  save(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
}
