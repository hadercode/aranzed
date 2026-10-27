export interface UnitOfMeasure {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  allowDecimals: boolean;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUomDto {
  code: string;
  name: string;
  isActive?: boolean;
  allowDecimals?: boolean;
}

export interface UpdateUomDto {
  code?: string;
  name?: string;
  isActive?: boolean;
  allowDecimals?: boolean;
}

export interface UomStats {
  total: number;
  active: number;
  inactive: number;
  allowDecimals: number;
  integersOnly: number;
}

export type UomStatusFilter = 'all' | 'active' | 'inactive';
export type UomDecimalsFilter = 'all' | 'decimals' | 'integers';

export interface UomFormData {
  id?: string;
  code: string;
  name: string;
  isActive: boolean;
  allowDecimals: boolean;
}
