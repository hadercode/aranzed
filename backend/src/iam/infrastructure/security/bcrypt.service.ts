import { Injectable } from '@nestjs/common';
import { IHashingService } from '../../application/ports/hashing.service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements IHashingService {
  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
