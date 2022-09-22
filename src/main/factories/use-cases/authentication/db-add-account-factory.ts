import { DbAddAccount } from "../../../../data/use-cases/add-account/db-add-account";
import { AddAccount } from "../../../../domain/use-cases/add-account";
import { BcrypterAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository";

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12;
  const bcrypterAdapter = new BcrypterAdapter(salt);

  const accountMongoRepository = new AccountMongoRepository();

  return new DbAddAccount(bcrypterAdapter, accountMongoRepository);
};
