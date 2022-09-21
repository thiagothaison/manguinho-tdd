import { MissingParamError, ServerError } from "../../errors";
import { ok, serverError, badRequest } from "../../helpers/http-helper";
import { SignUpController } from "./signup";
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation,
} from "./signup-protocols";

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
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

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccountStub, validationStub);

  return { sut, addAccountStub, validationStub };
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
});
