import { StaticTable } from '@/shared/components/ui';
import type { UseTransactionFormReturn } from '../../hooks/useTransactionForm';
import { TransactionItemTableRow } from './TransactionItemTableRow';

export interface TransactionItemsTableProps {
  formContext: UseTransactionFormReturn;
}

export function TransactionItemsTable({ formContext }: TransactionItemsTableProps) {
  const {
    items,
    removeItem,
    updateItem,
    selectProduct,
    products,
    txType,
    isEditMode,
    functionalSymbol,
  } = formContext;

  const isCostEditable = txType === 'RECEPTION';

  return (
    <StaticTable>
      <StaticTable.Head>
        <StaticTable.Row>
          <StaticTable.Th minWidth={280}>Producto *</StaticTable.Th>
          <StaticTable.Th align="right" minWidth={120}>
            Cantidad *
          </StaticTable.Th>
          <StaticTable.Th align="right" minWidth={120}>
            Costo Unit. ({functionalSymbol})
          </StaticTable.Th>
          <StaticTable.Th align="right" minWidth={120}>
            Subtotal
          </StaticTable.Th>
          <StaticTable.Th minWidth={140}>Lote / Control</StaticTable.Th>
          <StaticTable.Th minWidth={130}>Vencimiento</StaticTable.Th>
          <StaticTable.Th minWidth={180}>Observación</StaticTable.Th>
          {!isEditMode && <StaticTable.Th align="center" width={40}></StaticTable.Th>}
        </StaticTable.Row>
      </StaticTable.Head>
      <StaticTable.Body>
        {items.map((row, idx) => (
          <TransactionItemTableRow
            key={idx}
            row={row}
            idx={idx}
            isEditMode={isEditMode}
            isCostEditable={isCostEditable}
            products={products}
            onSelectProduct={selectProduct}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
          />
        ))}
      </StaticTable.Body>
    </StaticTable>
  );
}

export default TransactionItemsTable;
