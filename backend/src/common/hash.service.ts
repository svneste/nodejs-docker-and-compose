import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  getHash(pass: string): string {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
  }

  compare(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}
