import { Table } from '@/shared/components/ui';
import { useRecipeItemsColumns } from './useRecipeItemsColumns';

export function RecipeItemsTable() {
  const { columns, itemFields } = useRecipeItemsColumns();

  return (
    <Table
      columns={columns}
      data={itemFields}
      rowKey={(field) => field.id}
    />
  );
}
