export interface UpdateUomData {
  code?: string;
  name?: string;
  isActive?: boolean;
  allowDecimals?: boolean;
}

export class UpdateUomCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateUomData,
  ) {}
}
