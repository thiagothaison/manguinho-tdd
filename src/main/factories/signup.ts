import { DbAddAccount } from "../../data/use-cases/add-account/db-add-account";
import { BcrypterAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter();

  const salt = 12;
  const bcrypterAdapter = new BcrypterAdapter(salt);

  const accountMongoRepository = new AccountMongoRepository();

  const dbAddAccount = new DbAddAccount(
    bcrypterAdapter,
    accountMongoRepository
  );

  return new SignUpController(emailValidatorAdapter, dbAddAccount);
};
