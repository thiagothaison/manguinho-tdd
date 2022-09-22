import { MissingParamError, ServerError } from "../../errors";
import { ok, serverError, badRequest } from "../../helpers/http/http-helper";
import { SignUpController } from "./signup-controller";
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Authentication,
  AuthenticationModel,
  HttpRequest,
  Validation,
} from "./signup-controller-protocols";

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any name",
    email: "any@email.com",
    password: "anypassword",
    passwordConfirmation: "anypassword",
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "Valid Name",
  email: "valid@email.com",
  password: "valid_password",
});

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: unknown): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return "valid-token";
    }
  }

  return new AuthenticationStub();
};

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();

  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  );

  return { sut, addAccountStub, validationStub, authenticationStub };
};

describe("SignUp Controller", () => {
  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementation(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const request = makeFakeRequest();
    const response = await sut.handle(request);

    expect(response).toEqual(serverError(new ServerError()));
  });

  test("Should call AddAccount with correct values", () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");

    const request = makeFakeRequest();
    sut.handle(request);

    expect(addSpy).toHaveBeenCalledWith({
      name: "any name",
      email: "any@email.com",
      password: "anypassword",
    });
  });

  test("Should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();

    const request = makeFakeRequest();
    const response = await sut.handle(request);

    expect(response).toEqual(ok(makeFakeAccount()));
  });

  test("Should call Validation with correct values", () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");

    const request = makeFakeRequest();
    sut.handle(request);

    expect(validateSpy).toHaveBeenCalledWith(request.body);
  });

  test("Should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any-field"));

    const request = makeFakeRequest();
    const response = await sut.handle(request);

    expect(response).toEqual(badRequest(new MissingParamError("any-field")));
  });

  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const isValidSpy = jest.spyOn(authenticationStub, "auth");
    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
