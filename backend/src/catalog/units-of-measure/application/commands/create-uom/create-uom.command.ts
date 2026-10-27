export class CreateUomCommand {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly isActive?: boolean,
    public readonly allowDecimals?: boolean,
    public readonly createdById?: string,
  ) {}
}
