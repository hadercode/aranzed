export * from './requests';
export * from './queries';
export * from './responses';

// Alias de retrocompatibilidad
export { CreateInventoryTransactionDto as CreateTransactionDto } from './requests/create-inventory-transaction.dto';
export { UpdateInventoryTransactionDto as UpdateTransactionDto } from './requests/update-inventory-transaction.dto';
