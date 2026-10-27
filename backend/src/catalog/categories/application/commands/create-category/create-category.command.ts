export class CreateCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly parentId?: string,
    public readonly isActive?: boolean,
    public readonly createdById?: string,
  ) {}
}
