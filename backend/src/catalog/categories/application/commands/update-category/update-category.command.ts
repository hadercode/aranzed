export interface UpdateCategoryData {
  name?: string;
  parentId?: string | null;
  isActive?: boolean;
}

export class UpdateCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateCategoryData,
  ) {}
}
