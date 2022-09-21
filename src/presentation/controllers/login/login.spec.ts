import { Authentication } from "../../../domain/use-cases/authentication";
import { MissingParamError } from "../../errors/missing-param-error";
import {
  badRequest,
  serverError,
  unauthorized,
  ok,
} from "../../helpers/http-helper";
import { LoginController } from "./login";
import { HttpRequest, Validation } from "./login-protocols";

interface SutTypes {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any@email.com",
    password: "anypassword",
  },
});

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return "valid-token";
    }
  }

  return new AuthenticationStub();
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
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(authenticationStub, validationStub);

  return { sut, authenticationStub, validationStub };
};

describe("Login Controller", () => {
  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const isValidSpy = jest.spyOn(authenticationStub, "auth");
    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.password
    );
  });

  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unauthorized());
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

  test("Should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok({ token: "valid-token" }));
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
