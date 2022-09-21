import { InvalidParamError } from "../../errors/invalid-param-error";
import { MissingParamError } from "../../errors/missing-param-error";
import { badRequest, serverError } from "../../helpers/http-helper";
import { HttpRequest, EmailValidator } from "../signup/signup-protocols";
import { LoginController } from "./login";

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any@email.com",
    password: "anypassword",
  },
});

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);

  return { sut, emailValidatorStub };
};

describe("Login Controller", () => {
  test("Should return 400 if email is not provided", async () => {
    const { sut } = makeSut();
    const {
      body: { password },
    } = makeFakeRequest();

    const httpRequest = {
      body: { password },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("Should return 400 if password is not provided", async () => {
    const { sut } = makeSut();
    const {
      body: { email },
    } = makeFakeRequest();

    const httpRequest = {
      body: { email },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  test("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  test("Should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
