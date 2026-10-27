export interface WarehouseResponsible {
  id?: string;
  warehouseId?: string;
  userId: string;
  isPrimary: boolean;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  location?: string | null;
  isActive: boolean;
  isSalesWarehouse: boolean;
  responsibles?: WarehouseResponsible[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWarehouseDto {
  code: string;
  name: string;
  location?: string;
  isActive?: boolean;
  isSalesWarehouse?: boolean;
  responsibles?: Array<{ userId: string; isPrimary?: boolean }>;
}

export interface UpdateWarehouseDto extends Partial<CreateWarehouseDto> {}
