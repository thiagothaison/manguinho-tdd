import { DbAddAccount } from "../../data/use-cases/add-account/db-add-account";
import { BcrypterAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { Controller } from "../../presentation/protocols/controller";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LogControllerDecorator } from "../decorators/log";

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter();

  const salt = 12;
  const bcrypterAdapter = new BcrypterAdapter(salt);

  const accountMongoRepository = new AccountMongoRepository();

  const dbAddAccount = new DbAddAccount(
    bcrypterAdapter,
    accountMongoRepository
  );

  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  );

  return new LogControllerDecorator(signUpController);
};
