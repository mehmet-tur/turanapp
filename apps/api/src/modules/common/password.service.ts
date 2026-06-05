import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  async hash(password: string) {
    return argon2.hash(`${password}${process.env.PASSWORD_PEPPER ?? ''}`);
  }

  async verify(hash: string, password: string) {
    return argon2.verify(hash, `${password}${process.env.PASSWORD_PEPPER ?? ''}`);
  }
}
