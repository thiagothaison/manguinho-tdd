import { DbAddAccount } from "../../../data/use-cases/add-account/db-add-account";
import { BcrypterAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { SignUpController } from "../../../presentation/controllers/signup/signup-controller";
import { Controller } from "../../../presentation/protocols/controller";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcrypterAdapter = new BcrypterAdapter(salt);

  const accountMongoRepository = new AccountMongoRepository();
  const logMongoRepository = new LogMongoRepository();

  const dbAddAccount = new DbAddAccount(
    bcrypterAdapter,
    accountMongoRepository
  );

  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation()
  );

  return new LogControllerDecorator(signUpController, logMongoRepository);
};
