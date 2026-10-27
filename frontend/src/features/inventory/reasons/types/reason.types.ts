export type InventoryReasonType = 'INPUT' | 'OUTPUT' | 'BOTH';

export interface InventoryReason {
  id: string;
  name: string;
  type: InventoryReasonType;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryReasonDto {
  name: string;
  type: InventoryReasonType;
  description?: string;
}

export interface UpdateInventoryReasonDto extends Partial<CreateInventoryReasonDto> {}
