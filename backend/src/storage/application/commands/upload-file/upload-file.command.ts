export class UploadFileCommand {
  file: Express.Multer.File;
  folder?: string;
  userId?: string;

  constructor(file: Express.Multer.File, folder?: string, userId?: string) {
    this.file = file;
    this.folder = folder;
    this.userId = userId;
  }

  static from(file: Express.Multer.File, folder?: string, userId?: string): UploadFileCommand {
    return new UploadFileCommand(file, folder, userId);
  }
}
