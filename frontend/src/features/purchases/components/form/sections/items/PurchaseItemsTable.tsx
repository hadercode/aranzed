import { Table } from "@/shared/components/ui";
import {
  usePurchaseItemsColumns,
  type UsePurchaseItemsColumnsOptions,
} from "../../../../hooks/logic/usePurchaseItemsColumns";

export interface PurchaseItemsTableProps extends UsePurchaseItemsColumnsOptions {}

export function PurchaseItemsTable(props: PurchaseItemsTableProps) {
  const { columns, itemFields } = usePurchaseItemsColumns(props);

  return (
    <Table columns={columns} data={itemFields} rowKey={(field) => field.id} />
  );
}

export default PurchaseItemsTable;
