export class DeleteFileCommand {
  key: string;
  userId?: string;

  constructor(key: string, userId?: string) {
    this.key = key;
    this.userId = userId;
  }
}
