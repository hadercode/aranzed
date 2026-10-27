import { AuditRule } from '../audit-rule.types';
import { CategoryOrmEntity } from '../../../../catalog/categories/infrastructure/persistence/typeorm/entities/category.orm-entity';
import { UnitOfMeasureOrmEntity } from '../../../../catalog/units-of-measure/infrastructure/persistence/typeorm/entities/unit-of-measure.orm-entity';
import { ProductOrmEntity } from '../../../../catalog/products/infrastructure/persistence/typeorm/entities/product.orm-entity';
import { RecipeOrmEntity } from '../../../../catalog/recipes/infrastructure/persistence/typeorm/entities/recipe.orm-entity';

export const catalogAuditRules: AuditRule[] = [
  {
    path: '/catalog/categories',
    model: 'Categorías',
    action: (_req, method) => {
      if (method === 'POST') return 'CREATE';
      if (method === 'PUT') return 'UPDATE';
      if (method === 'DELETE') return 'DELETE';
      return method;
    },
    description: (_req, method) => {
      if (method === 'POST') return 'Creación de nueva categoría en catálogo';
      if (method === 'PUT') return 'Actualización de categoría en catálogo';
      if (method === 'DELETE') return 'Eliminación de categoría en catálogo';
      return `${method} en Categorías`;
    },
    entity: {
      target: CategoryOrmEntity,
      resolveId: (req) => req.params?.id || null,
    },
  },
  {
    path: '/catalog/uofm',
    model: 'Unidades de Medida',
    action: (_req, method) => {
      if (method === 'POST') return 'CREATE';
      if (method === 'PUT') return 'UPDATE';
      if (method === 'DELETE') return 'DELETE';
      return method;
    },
    description: (_req, method) => {
      if (method === 'POST')
        return 'Creación de nueva unidad de medida en catálogo';
      if (method === 'PUT')
        return 'Actualización de unidad de medida en catálogo';
      if (method === 'DELETE')
        return 'Eliminación de unidad de medida en catálogo';
      return `${method} en Unidades de Medida`;
    },
    entity: {
      target: UnitOfMeasureOrmEntity,
      resolveId: (req) => req.params?.id || null,
    },
  },
  {
    path: '/catalog/products',
    model: 'Productos',
    action: (_req, method) => {
      if (method === 'POST') return 'CREATE';
      if (method === 'PUT') return 'UPDATE';
      if (method === 'DELETE') return 'DELETE';
      return method;
    },
    description: (_req, method) => {
      if (method === 'POST') return 'Creación de nuevo producto en catálogo';
      if (method === 'PUT') return 'Actualización de producto en catálogo';
      if (method === 'DELETE') return 'Eliminación de producto en catálogo';
      return `${method} en Productos`;
    },
    entity: {
      target: ProductOrmEntity,
      resolveId: (req) => req.params?.id || null,
    },
  },
  {
    path: '/catalog/recipes',
    model: 'Recetas / BOM',
    action: (_req, method) => {
      if (method === 'POST') return 'CREATE';
      if (method === 'PUT') return 'UPDATE';
      if (method === 'DELETE') return 'DELETE';
      return method;
    },
    description: (_req, method) => {
      if (method === 'POST') return 'Creación de receta de fabricación (BOM)';
      if (method === 'PUT')
        return 'Actualización de receta de fabricación (BOM)';
      if (method === 'DELETE')
        return 'Eliminación de receta de fabricación (BOM)';
      return `${method} en Recetas`;
    },
    entity: {
      target: RecipeOrmEntity,
      resolveId: (req) => req.params?.id || null,
    },
  },
];
