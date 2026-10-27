import { Table } from "@/shared/components/ui";
import { usePurchaseItemsColumns } from "../../../../hooks/logic/usePurchaseItemsColumns";

export function PurchaseItemsTable() {
  const { columns, itemFields } = usePurchaseItemsColumns();

  return (
    <Table columns={columns} data={itemFields} rowKey={(field) => field.id} />
  );
}

export default PurchaseItemsTable;
