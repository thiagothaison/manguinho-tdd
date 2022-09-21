import bcrypt from "bcryptjs";

import { Hasher } from "../../data/protocols/criptography/hasher";

export class BcrypterAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }
}
