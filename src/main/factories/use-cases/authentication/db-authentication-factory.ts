import { DbAuthentication } from "../../../../data/use-cases/authentication/db-authentication";
import { Authentication } from "../../../../domain/use-cases/authentication";
import { BcrypterAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../../infra/criptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository";
import env from "../../../config/env";

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const bcrypterAdapter = new BcrypterAdapter(salt);

  const jwtAdapter = new JwtAdapter(env.jwtSecret);

  const accountMongoRepository = new AccountMongoRepository();

  return new DbAuthentication(
    accountMongoRepository,
    bcrypterAdapter,
    jwtAdapter,
    accountMongoRepository
  );
};
