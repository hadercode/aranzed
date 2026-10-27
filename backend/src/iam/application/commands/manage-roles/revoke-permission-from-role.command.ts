export class RevokePermissionFromRoleCommand {
  constructor(
    public readonly roleId: string,
    public readonly permissionId: string,
  ) {}
}
