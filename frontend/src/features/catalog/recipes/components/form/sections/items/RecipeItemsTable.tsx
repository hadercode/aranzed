import { Table } from '@/shared/components/ui';
import type { UseRecipeFormPageReturn } from '../../../../hooks/logic/useRecipeFormPage';
import { useRecipeItemsColumns } from './useRecipeItemsColumns';

export interface RecipeItemsTableProps {
  formPage: UseRecipeFormPageReturn;
}

export function RecipeItemsTable({ formPage }: RecipeItemsTableProps) {
  const { columns, itemFields } = useRecipeItemsColumns(formPage);

  return (
    <Table
      columns={columns}
      data={itemFields}
      rowKey={(field) => field.id}
    />
  );
}

export default RecipeItemsTable;
