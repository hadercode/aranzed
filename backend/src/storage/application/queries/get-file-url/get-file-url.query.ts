export class GetFileUrlQuery {
  key: string;
  expiresIn?: number;

  constructor(key: string, expiresIn?: number) {
    this.key = key;
    this.expiresIn = expiresIn;
  }
}
