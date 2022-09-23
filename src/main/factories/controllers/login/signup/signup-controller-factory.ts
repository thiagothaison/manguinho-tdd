import { SignUpController } from "../../../../../presentation/controllers/login/signup/signup-controller";
import { Controller } from "../../../../../presentation/protocols/controller";
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator-factory";
import { makeDbAddAccount } from "../../../use-cases/authentication/db-add-account-factory";
import { makeDbAuthentication } from "../../../use-cases/authentication/db-authentication-factory";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  );

  return makeLogControllerDecorator(signUpController);
};
